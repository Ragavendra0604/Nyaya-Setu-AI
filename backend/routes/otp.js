const express = require('express');
const { db, admin } = require('../config/firebase');
const { Resend } = require('resend');

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

// Generate and send OTP
router.post('/send', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store in Firestore
        await db.collection('otps').doc(email).set({
            otp,
            expiresAt,
            attempts: 0
        });

        // Send via Resend
        let sendError = null;
        const isMockMode = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_123';

        if (isMockMode) {
            console.log('\n---------------------------------------');
            console.log('MOCK OTP MODE ENABLED');
            console.log(`Email: ${email}`);
            console.log(`OTP: ${otp}`);
            console.log('---------------------------------------\n');
        } else {
            const { data, error } = await resend.emails.send({
                from: 'NyayaSetu <onboarding@resend.dev>',
                to: [email],
                subject: 'Your NyayaSetu Login Code',
                html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #2ecc71;">⚖️ NyayaSetu Verification</h2>
              <p>Use the code below to sign in to your account. It expires in 10 minutes.</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px; background: #f9f9f9; text-align: center;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 12px; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
            });
            if (error) sendError = error;
        }

        if (sendError) {
            console.error('Resend Error:', sendError);
            return res.status(500).json({ error: 'Failed to send email' });
        }

        res.json({
            ok: true,
            message: isMockMode ? 'OTP generated (Check server console)' : 'OTP sent successfully',
            isMock: isMockMode
        });
    } catch (error) {
        console.error('OTP Send Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify OTP
router.post('/verify', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

        const doc = await db.collection('otps').doc(email).get();
        if (!doc.exists) return res.status(400).json({ error: 'OTP not requested or expired' });

        const data = doc.data();
        if (new Date() > data.expiresAt.toDate()) {
            return res.status(400).json({ error: 'OTP expired' });
        }

        if (data.otp !== otp) {
            // Increment attempts
            await db.collection('otps').doc(email).update({
                attempts: admin.firestore.FieldValue.increment(1)
            });
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        // Success - Delete OTP record
        await db.collection('otps').doc(email).delete();

        // Check if user exists in Firebase Auth
        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(email);
            console.log(`Found existing Firebase user for OTP login: ${userRecord.uid}`);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                // Create new Firebase user
                userRecord = await admin.auth().createUser({
                    email,
                    emailVerified: true,
                    displayName: email.split('@')[0],
                });
                console.log(`Created new Firebase user for OTP login: ${userRecord.uid}`);
            } else {
                throw error;
            }
        }

        res.json({
            ok: true,
            message: 'OTP verified successfully',
            uid: userRecord.uid,
            email: userRecord.email
        });
    } catch (error) {
        console.error('OTP Verify Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
