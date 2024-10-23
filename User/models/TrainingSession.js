const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  type: { type: String, enum: ['training', 'coaching'], required: true },
  maxParticipants: { type: Number, default: 50 },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  link: { type: String },
});

module.exports = mongoose.model('Session', sessionSchema);

router.post('/generate-invite-codes', async (req, res) => {
    try {
      const { conferenceId, participants } = req.body; // List of participant userIds
  
      const conference = await VideoConference.findById(conferenceId);
      if (!conference) {
        return res.status(404).json({ error: 'Conference not found' });
      }
  
      if (conference.participants.length + participants.length > 50) {
        return res.status(400).json({ error: 'Maximum participants limit reached' });
      }
  
      //Generate invite codes and add participants
      participants.forEach(userId => {
        const inviteCode = shortid.generate();
        conference.participants.push({ userId, inviteCode });
      });
  
      await conference.save();
      return res.status(201).json({ message: 'Invite codes generated', participants: conference.participants });
    } catch (error) {
      return res.status(500).json({ error: 'Error generating invite codes' });
    }
  });

  router.post('/join', async (req, res) => {
    try {
      const { conferenceId, inviteCode } = req.body;
  
      const conference = await VideoConference.findById(conferenceId);
      if (!conference) {
        return res.status(404).json({ error: 'Conference not found' });
      }
  
      const participant = conference.participants.find(p => p.inviteCode === inviteCode);
      if (!participant) {
        return res.status(400).json({ error: 'Invalid invite code' });
      }
  
      if (participant.joinedAt) {
        return res.status(400).json({ error: 'Invite code has already been used' });
      }
  
      participant.joinedAt = new Date();
      await conference.save();
  
      return res.status(200).json({ message: 'Successfully joined the conference', link: conference.inviteLink });
    } catch (error) {
      return res.status(500).json({ error: 'Error joining conference' });
    }
  });
  