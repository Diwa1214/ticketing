import { BasePulisher, OrderCreatedInterfacr, Subjects } from '@dkpackage/common';

export class OrderCreatedPublisher extends BasePulisher<OrderCreatedInterfacr> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
