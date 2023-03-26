import { Subjects,BasePulisher,TicketCreatedInterface } from "@dkpackage/common";


export class TicketCreation extends BasePulisher<TicketCreatedInterface>{
   
    subject: Subjects.TicketCreated = Subjects.TicketCreated;



}

