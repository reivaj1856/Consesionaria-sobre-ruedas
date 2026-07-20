import { Repository } from 'typeorm';
import { Quote } from './entities/quote.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';
export declare class QuotesService {
    private readonly quoteRepository;
    constructor(quoteRepository: Repository<Quote>);
    create(createQuoteDto: CreateQuoteDto): Promise<Quote>;
    findAll(): Promise<Quote[]>;
}
