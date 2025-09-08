const express = require('express');
const multer = require('multer');
const Video = require('../models/Video');
const cloudinary = require('../config/cloudinary');
const auth = require('../middlewares/auth');
const axios = require('axios');
const groq = require('../config/groq');
const User = require('../models/User');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const s3 = require('../config/aws');

router.post('/upload', auth, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send({ error: "No file uploaded" });

    const userPlan = req.user.plan;

    if (userPlan === 'free') {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'video' },
        async (error, result) => {
          if (error) return res.status(500).send({ error: "Upload to Cloudinary failed" });

          const newVideo = new Video({
            originalName: req.file.originalname,
            cloudURL: result.secure_url,
            publicId: result.public_id,
            status: 'uploaded',
            userId: req.user.id
          });

          await newVideo.save();
          res.json({ message: "File uploaded successfully (Cloudinary)", url: result.secure_url });
        }
      );

      uploadStream.end(req.file.buffer);
    } else if (userPlan === 'paid') {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `videos/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      };

      const s3Upload = await s3.upload(params).promise();

      const newVideo = new Video({
        originalName: req.file.originalname,
        cloudURL: s3Upload.Location,
        publicId: s3Upload.Key,
        status: 'uploaded',
        userId: req.user.id
      });

      await newVideo.save();
      res.json({ message: "File uploaded successfully (AWS S3)", url: s3Upload.Location });
    } else {
      return res.status(400).json({ error: "Invalid user plan" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Upload failed", details: error.message });
  }
});


router.get('/my-videos', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const videos = await Video.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(videos);
  }
  catch (error) {
    return res.status(500).json({ error: "Failed to fetch videos" });
  }
});


router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (video.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Not authorized to delete this video" });
    }

    if (req.user.plan === 'free') {
      await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
    } else if (req.user.plan === 'paid') {
      const AWS = require('aws-sdk');
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION
      });

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: video.s3Key
      };

      await s3.deleteObject(params).promise();
    }

    await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the video" });
  }
});


router.post('/transcribe/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (video.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Not authorized to transcribe this video" });
    }

    if (req.user.plan === 'free') {
      const response = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        {
          audio_url: video.cloudURL,
          webhook_url: `${process.env.BASE_URL}/api/videos/webhook?videoId=${video._id}`
        },
        {
          headers: {
            'Authorization': process.env.ASSEMBLYAI_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      video.status = 'processing';
      await video.save();

      return res.status(200).json({ message: "Transcription started with AssemblyAI" });

    } else if (req.user.plan === 'paid') {
      const AWS = require('aws-sdk');
      const transcribe = new AWS.TranscribeService({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION
      });

      const jobName = `transcribe-${Date.now()}`;
      const params = {
        TranscriptionJobName: jobName,
        LanguageCode: 'en-US',
        MediaFormat: 'mp4',
        Media: {
          MediaFileUri: `s3://${process.env.AWS_S3_BUCKET_NAME}/${video.publicId}`
        },
        OutputBucketName: process.env.AWS_S3_BUCKET_NAME
      };

      await transcribe.startTranscriptionJob(params).promise();

      video.status = 'processing';
      video.transcriptionJobName = jobName;
      await video.save();

      let jobStatus = 'IN_PROGRESS';
      let transcriptionText = '';

      while (jobStatus === 'IN_PROGRESS') {
        await new Promise(resolve => setTimeout(resolve, 5000));

        const job = await transcribe.getTranscriptionJob({ TranscriptionJobName: jobName }).promise();
        jobStatus = job.TranscriptionJob.TranscriptionJobStatus;

        if (jobStatus === 'COMPLETED') {
          const transcriptFileUri = job.TranscriptionJob.Transcript.TranscriptFileUri;
          const key = transcriptFileUri.split('/').pop();

          const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Expires: 60
          });

          const transcriptResponse = await axios.get(signedUrl);
          const transcriptionText = transcriptResponse.data.results.transcripts[0].transcript;

          video.status = 'transcribed';
          video.transcript = transcriptionText;
          await video.save();

          return res.status(200).json({ message: "Transcription completed", transcript: transcriptionText });
        }

        if (jobStatus === 'FAILED') {
          video.status = 'failed';
          await video.save();
          return res.status(500).json({ message: "Transcription failed" });
        }
      }
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to start transcription', details: error.message });
  }
});



router.post('/webhook', async (req, res) => {
  try {
    const { status, transcript_id } = req.body;
    const videoId = req.query.videoId;

    // console.log("Webhook payload:",req.body);

    const video = await Video.findById(videoId);

    if (!video) return res.status(404).json({ message: "Video not found" });

    if (status === 'completed') {
      const response = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcript_id}`, {
        headers: {
          'Authorization': process.env.ASSEMBLYAI_API_KEY
        }
      });
      video.transcript = response.data.text || '';
      video.status = 'transcribed';
    }
    else if (status === 'failed') {
      video.status = 'failed';
      video.transcript = '';
    }

    await video.save();

    res.status(200).json({ message: 'Webhook received successfully', status, message: video.transcript || null });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.get('/admin/videos', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized access this information' });
    }

    const videos = await Video.find().populate('userId', 'name email');
    return res.status(200).json({ videos });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.delete('/admin/delete-video/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to delete this video" });
    }

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    if (video.storageType === 'cloudinary') {
      await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
    } else if (video.storageType === 's3') {
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: video.s3Key
      }).promise();
    }

    await video.deleteOne();

    return res.status(200).json({ message: 'Video deleted successfully' });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



router.get('/admin/user-videos/:id', auth, async (req, res) => {
  try {
    const videos = await Video.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json({ videos });
  }
  catch (error) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});


router.get('/download-transcript/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video || !video.transcript) return res.status(404).json({ error: "Video or transcript is not available" });

    if (video.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.setHeader('Content-Disposition', `attachment; filename=${video.originalName}.txt`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(video.transcript);
  }
  catch (error) {
    res.status(500).json({ error: 'Failed to download transcript' });
  }
});


router.post('/summarize/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (video.userId.toString() !== req.user.id && req.user.role != 'admin') {
      return res.status(401).json({ error: "Not authorized" });
    }

    if (!video.transcript || video.transcript.trim() === '') {
      return res.status(400).json({ error: "Transcript is empty cannot summarize" });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an expert text summarizer" },
        { role: "user", content: `Summarize this transcript:\n${video.transcript}` }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const summary = response.choices[0].message.content;

    video.summary = summary;
    await video.save();

    return res.status(200).json({
      message: "Summary generated successfully",
      summary
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to generate summary", details: error.message });
  }
});


router.get('/admin/allUsers', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Not authorized" });
    }

    const users = await User.find().select('-password');

    return res.status(200).json({ users });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.delete('/admin/deleteUserAllInfo/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Not authorized" });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    const videos = await Video.find({ userId });

    for (const video of videos) {
      if (video.storageType === 'cloudinary') {
        await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
      } else if (video.storageType === 's3') {
        await s3.deleteObject({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: video.s3Key
        }).promise();
      }
    }

    await Video.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User and all associated videos deleted successfully" });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


module.exports = router;