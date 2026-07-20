import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
export declare class QuotesController {
    private readonly quotesService;
    constructor(quotesService: QuotesService);
    create(createQuoteDto: CreateQuoteDto): Promise<import("./entities/quote.entity").Quote>;
    findAll(): Promise<import("./entities/quote.entity").Quote[]>;
}
