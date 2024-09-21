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

@Module({
  imports: [
    GlobalModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: mg({
        auth: {
          api_key: env.mailgunApiKey,
          domain: env.mailgunDomain,
        },
      }),
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
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
