/**
 * SMS Service - Send OTP via SMS provider
 * Supports multiple providers: Twilio, bKash SMS, Nexmo, etc.
 */

interface SMSConfig {
  provider: 'twilio' | 'bkash' | 'nexmo' | 'mock';
  apiKey: string;
  senderId: string;
}

export class SMSService {
  private config: SMSConfig;

  constructor() {
    const provider = (process.env.SMS_PROVIDER || 'mock') as SMSConfig['provider'];

    this.config = {
      provider,
      apiKey: process.env.SMS_API_KEY || '',
      senderId: process.env.SMS_SENDER_ID || 'DAWAI',
    };
  }

  async sendOTP(phone: string, otp: string): Promise<boolean> {
    const message = `Your Dawai Medicine verification code is: ${otp}. Valid for 10 minutes. Do not share this code.`;

    try {
      switch (this.config.provider) {
        case 'twilio':
          return await this.sendViatwilio(phone, message);
        case 'bkash':
          return await this.sendViaBKash(phone, message);
        case 'nexmo':
          return await this.sendViaNexmo(phone, message);
        case 'mock':
          return await this.sendViaMock(phone, message);
        default:
          console.warn(`Unknown SMS provider: ${this.config.provider}`);
          return await this.sendViaMock(phone, message);
      }
    } catch (error) {
      console.error(`SMS sending failed for ${phone}:`, error);
      return false;
    }
  }

  private async sendViatwilio(phone: string, message: string): Promise<boolean> {
    try {
      // Twilio format: +880XXXXXXXXXX
      const twilioPhone = this.formatPhoneForTwilio(phone);

      const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + this.config.apiKey.split(':')[0] + '/Messages.json', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(this.config.apiKey).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: this.config.senderId,
          To: twilioPhone,
          Body: message,
        }).toString(),
      });

      if (response.ok) {
        console.log(`✅ SMS sent via Twilio to ${phone}`);
        return true;
      } else {
        console.error('Twilio error:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('Twilio send error:', error);
      return false;
    }
  }

  private async sendViaBKash(phone: string, message: string): Promise<boolean> {
    try {
      // bKash SMS API endpoint
      const response = await fetch('https://api.bkash.com/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          phone: this.formatPhoneForBD(phone),
          message: message,
          senderId: this.config.senderId,
        }),
      });

      if (response.ok) {
        console.log(`✅ SMS sent via bKash to ${phone}`);
        return true;
      } else {
        console.error('bKash error:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('bKash send error:', error);
      return false;
    }
  }

  private async sendViaNexmo(phone: string, message: string): Promise<boolean> {
    try {
      const response = await fetch('https://rest.nexmo.com/sms/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.config.apiKey,
          api_secret: process.env.SMS_API_SECRET || '',
          to: this.formatPhoneForTwilio(phone),
          from: this.config.senderId,
          text: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.messages?.[0]?.status === '0') {
          console.log(`✅ SMS sent via Nexmo to ${phone}`);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Nexmo send error:', error);
      return false;
    }
  }

  private async sendViaMock(phone: string, message: string): Promise<boolean> {
    // Development mode: just log
    console.log('📱 [MOCK SMS]');
    console.log(`To: ${phone}`);
    console.log(`Message: ${message}`);
    console.log(`SenderID: ${this.config.senderId}`);
    console.log('---');
    return true;
  }

  private formatPhoneForTwilio(phone: string): string {
    // Convert 01xxxxxxxxx to +880xxxxxxxxx
    if (phone.startsWith('0')) {
      return '+880' + phone.substring(1);
    }
    if (!phone.startsWith('+')) {
      return '+880' + phone;
    }
    return phone;
  }

  private formatPhoneForBD(phone: string): string {
    // Keep Bangladesh format: 01xxxxxxxxx or 880xxxxxxxxx
    if (phone.startsWith('0')) {
      return phone;
    }
    return '0' + phone.substring(phone.length - 10);
  }
}

export const smsService = new SMSService();
