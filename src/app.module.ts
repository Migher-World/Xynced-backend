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
import * as path from 'path';
import { AcceptLanguageResolver, HeaderResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { ReportModule } from './modules/report/report.module';
const mg = require('nodemailer-mailgun-transport');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  env.googleapis.clientId,
  env.googleapis.clientSecret,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: env.emailRefreshToken
});



@Module({
  imports: [
    GlobalModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: async () => {
        const accessToken = await oauth2Client.getAccessToken();
        
        return {
          transport: {
            service: 'gmail',
            scope: 'https://mail.google.com',
            auth: {
              type: 'OAuth2',
              clientId: env.googleapis.clientId,
              clientSecret: env.googleapis.clientId,
              refreshToken: accessToken.res.data.refresh_token,
              accessToken: accessToken.token,
              user: env.emailUser,
              // pass: env.emailPassword,
            },
            tls: {
              rejectUnauthorized: false
            }            
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
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      loader: I18nJsonLoader,
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
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
    FeedbackModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
