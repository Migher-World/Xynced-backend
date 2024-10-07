import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AppDataSource, typeOrmConfig } from './config/db.config';
import { EmailsModule } from './shared/alerts/emails/emails.module';
import { NotificationsModule } from './shared/alerts/notifications/notifications.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import env from './config/env.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { BullModule } from '@nestjs/bull';
import { WebsocketModule } from './websockets/websocket.module';
import { GlobalModule } from './global.module';
import { KycModule } from './modules/kyc/kyc.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import IORedis from 'ioredis';
import { StripeModule } from 'nestjs-stripe';
import { MatchModule } from './modules/match/match.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { MessagesModule } from './modules/messages/messages.module';
const mg = require('nodemailer-mailgun-transport');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  env.googleapis.clientId,
  env.googleapis.clientSecret,
  'http://localhost'
);


const refreshToken = "1//03bwqTfsWUpsuCgYIARAAGAMSNwF-L9Irz_aMFm3Gvmsd16wR68r2je4qjz5IZLr4zd1NQJ9Ka_lpzPgw-tQ31z643VpulHJy2g0";

oauth2Client.setCredentials({
  refresh_token: refreshToken
});



@Module({
  imports: [
    GlobalModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: async () => {
        const accessToken = await oauth2Client.getAccessToken();
        
        console.log(accessToken.token);
        
        return {
          // transport: {
          //   // host: process.env.EMAIL_HOST,
          //   // secure: true,
          //   // port: 465,
          //   service: 'gmail',
          //   auth: {
          //     type: 'OAuth2',
          //     clientId: env.googleapis.clientId,
          //     clientSecret: env.googleapis.clientId,
          //     refreshToken: refreshToken,
          //     accessToken: accessToken.token,
          //     user: env.emailUser,
          //     // pass: env.emailHost,
          //   },
          // },
          transport: {
            host: env.emailHost,
            secure: true,
            auth: {
              user: env.emailUser,
              pass: env.emailPassword,
            },
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        }
      },
    }),
    BullModule.forRoot({
      createClient: () =>
        new IORedis(env.redisUrl, {
          enableReadyCheck: false,
          maxRetriesPerRequest: null,
        }),
    }),
    StripeModule.forRoot({
      apiKey: 'my_secret_key',
      apiVersion: '2024-06-20'
    }),
    // FirebaseAdminModule.forRootAsync({
    //   useFactory: () => ({
    //     credential: admin.credential.applicationDefault(),
    //   }),
    // }),

    AuthModule,
    EmailsModule,
    NotificationsModule,
    WebsocketModule,
    KycModule,
    ProfileModule,
    SubscriptionModule,
    MatchModule,
    ConversationModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
