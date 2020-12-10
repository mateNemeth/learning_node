import { NotificationTemplate } from "../interfaces/notification_template";
import { Database } from "../database/database";
import { User } from "../interfaces/user";
import { NotificationTemplateRepository } from "../repositories/notification_template.repository";

export class NotificationService {
  private notificationTemplateDb = new NotificationTemplateRepository(Database.getInstance());

  async sendNotification(user: User, event: string) {
    const notifications = await this.notificationTemplateDb.findAll<NotificationTemplate>({send_at: event});

    notifications.forEach(n => {
      this.fakeNotification(n, user);
    })
  }

  private fakeNotification(n: NotificationTemplate, u: User) {
    // sending actual notifications would take place here...
  }
}