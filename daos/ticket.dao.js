import Ticket from "../schemas/ticket.schema.js";

class TicketDAO {
    static async createTicket(code, amount, purchaser){
        return await Ticket.create({ code, amount, purchaser });
    }
}

export default TicketDAO;