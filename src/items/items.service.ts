import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDto } from './dtos/create-item.dto';
import { User } from '../users/user.entity';
import { QueryItemDto } from './dtos/query-item.dto';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>,
    ) {}

    async getAllItems(queryItems: QueryItemDto) {
        const query = await this.itemRepository.createQueryBuilder()
        .select('*')
        .where('approved = :approved', { approved: true })

        if (queryItems.name) {
            query.andWhere('name LIKE :name', { name: `%${queryItems.name}%` })
        }

        if (queryItems.category) {
            query.andWhere('category LIKE :category', { category: `%${queryItems.category}%` })
        }

        if (queryItems.location) {
            query.andWhere('location LIKE :location', { location: `%${queryItems.location}%` })
        }

        return query.getRawMany();
    }

    create(item: CreateItemDto, user: User) {
        const newItem = this.itemRepository.create(item);
        newItem.user = user;
        return this.itemRepository.save(newItem);
    }

    async approveItem(id: number, approved: boolean) {
        const item = await this.itemRepository.findOneBy({ id });
        if (!item) {
            throw new NotFoundException('Item not found');
        }
        item.approved = approved;
        return this.itemRepository.save(item);
    }
}
