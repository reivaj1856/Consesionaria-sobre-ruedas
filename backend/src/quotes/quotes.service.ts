import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './entities/quote.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
  ) {}

  async create(createQuoteDto: CreateQuoteDto) {
    const quote = this.quoteRepository.create({
      ...createQuoteDto,
      fecha: new Date().toISOString().split('T')[0],
    });

    return this.quoteRepository.save(quote);
  }

  async findAll() {
    return this.quoteRepository.find({
      relations: { vehicle: true },
      order: { fecha: 'DESC' },
    });
  }
}
