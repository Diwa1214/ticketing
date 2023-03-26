import { BasePulisher, ExpirationCompleteEvent, Subjects } from "@dkpackage/common";


export class  ExpirationCompletedPublisher extends BasePulisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}