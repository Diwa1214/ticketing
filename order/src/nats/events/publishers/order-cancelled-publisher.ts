import { Subjects, BasePulisher, OrderCancelledInterface } from '@dkpackage/common';

export class OrderCancelledPublisher extends BasePulisher<OrderCancelledInterface> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
