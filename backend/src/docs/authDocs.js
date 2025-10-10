/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related routes
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user, stores hashed password, generates OTP, and sends it to the user's email for verification.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - nickname
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               nickname:
 *                 type: string
 *                 example: johnd
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       201:
 *         description: User registered successfully, OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered. OTP sent to email.
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64a8a7f0e9d1b2c3d4567890
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                     nickname:
 *                       type: string
 *                       example: johnd
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Validation error (e.g., missing fields or email/nickname already taken)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                   example: Full name is required
 *                 nickname:
 *                   type: string
 *                   example: Nickname is required
 *                 email:
 *                   type: string
 *                   example: Email is required
 *                 password:
 *                   type: string
 *                   example: Password is required
 *               example:
 *                 email: johndoe@example.com is already taken
 *                 nickname: johnd is already taken
 *       500:
 *         description: Server error (e.g., email service not configured or database error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /auth/request-otp:
 *   post:
 *     summary: Request OTP for email verification
 *     description: Sends a new OTP to the user's email for verification.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An OTP has been sent to johndoe@example.com
 *       400:
 *         description: Missing email field
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error (e.g., email service not configured)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for user email
 *     description: Verifies the OTP sent to the user's email and returns a JWT token upon successful verification.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64a8a7f0e9d1b2c3d4567890
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                     nickname:
 *                       type: string
 *                       example: johnd
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid or missing OTP/email or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid OTP
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log user in
 *     description: Authenticates a user with email and password, returning a JWT token upon successful login.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64a8a7f0e9d1b2c3d4567890
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                     nickname:
 *                       type: string
 *                       example: johnd
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     avatar:
 *                       type: string
 *                       example: https://example.com/avatar.jpg
 *                     currency:
 *                       type: string
 *                       example: USD
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is required
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       403:
 *         description: Account not verified or not active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please verify your email before logging in
 *                 requiresVerification:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password after verifying a valid OTP.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPass123
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successful
 *       400:
 *         description: Missing or invalid email/password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is required | Password is required | Password must be at least 8 characters
 *       403:
 *         description: OTP not verified or verification expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP not verified | OTP verification expired
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
