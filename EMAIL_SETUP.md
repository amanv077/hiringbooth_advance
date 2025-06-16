# Email Setup Instructions for HiringBooth

## Gmail Setup (Recommended)

### 1. Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### 2. Generate App Password
1. In Google Account Security settings
2. Click on "2-Step Verification"
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password (e.g., "abcd efgh ijkl mnop")

### 3. Update .env file
Replace the EMAIL_PASS in your .env file:
```
EMAIL_PASS="your-16-character-app-password-here"
```

## Alternative Email Providers

### SendGrid (Production Recommended)
```env
EMAIL_HOST="smtp.sendgrid.net"
EMAIL_PORT="587"
EMAIL_USER="apikey"
EMAIL_PASS="your-sendgrid-api-key"
```

### Mailgun
```env
EMAIL_HOST="smtp.mailgun.org"
EMAIL_PORT="587"
EMAIL_USER="your-mailgun-smtp-username"
EMAIL_PASS="your-mailgun-smtp-password"
```

### SMTP2GO
```env
EMAIL_HOST="mail.smtp2go.com"
EMAIL_PORT="587"
EMAIL_USER="your-smtp2go-username"
EMAIL_PASS="your-smtp2go-password"
```

## Testing

1. Start your development server: `npm run dev`
2. Test email connection: `GET http://localhost:3000/api/test-email`
3. Send test email: `POST http://localhost:3000/api/test-email` with body:
   ```json
   {
     "email": "your-test-email@example.com",
     "name": "Test User"
   }
   ```

## Common Issues

1. **Gmail "Less secure app access"** - This is deprecated. Use App Passwords instead.
2. **Network restrictions** - Ensure your hosting provider allows SMTP on port 587
3. **Firewall issues** - Check if outbound SMTP connections are blocked

## Production Considerations

- Use environment variables for all email configuration
- Consider using a dedicated email service (SendGrid, Mailgun, etc.)
- Monitor email delivery rates and bounce rates
- Implement email rate limiting to prevent abuse
