import { Subjects,BasePulisher,TicketCreatedInterface } from "@dkpackage/common";


export class TicketUpdate extends BasePulisher<TicketCreatedInterface>{
   
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

}

