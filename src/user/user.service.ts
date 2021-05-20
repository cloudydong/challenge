import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MarkEpisodeOutput } from 'src/listener/dto/mark-episode.dto';
import { ReivewPodcastsOutput } from 'src/listener/dto/review-podcast.dto';
import { SeeSubscriptionsOutput } from 'src/listener/dto/see-subscriptions.dto';
import { SubscribePodcastOutput } from 'src/listener/dto/subscribe-podcast.dto';
import { Review } from 'src/listener/entity/review.entity';
import { Episode } from 'src/podcast/entity/episode.entity';
import { Podcast } from 'src/podcast/entity/podcast.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.userRepository.findOne({ email });
      if (exists) {
        return {
          ok: false,
          error: 'can not create user because already email',
        };
      }
      await this.userRepository.save(
        this.userRepository.create({ email, password, role }),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'fail create user' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) return { ok: false, error: 'can not find user by email' };

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect)
        return {
          ok: false,
          error: 'can not login user because wrong password',
        };

      const token = this.jwtService.sign({ id: user.id });

      return { ok: true, token };
    } catch (error) {
      return { ok: false, error: 'fail login user' };
    }
  }

  async findById({ userId: id }: UserProfileInput): Promise<UserProfileOutput> {
    try {
      const user = await this.userRepository.findOneOrFail({ id });
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: 'can not find user by id' };
    }
  }

  async editProfile(
    userId: number,
    { password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.userRepository.findOneOrFail(userId);
      if (password) {
        user.password = password;
      }
      await this.userRepository.save(user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'fail edit user profile' };
    }
  }

  async createReviewPodcast(
    userId: number,
    podcastId: number,
    comment: string,
  ): Promise<ReivewPodcastsOutput> {
    try {
      const user = await this.userRepository.findOneOrFail(userId, {
        relations: ['reviews'],
      });
      const podcast = await this.podcastRepository.findOneOrFail(podcastId);
      const review = this.reviewRepository.create({
        comment,
        author: user,
        podcast,
      });

      user.reviews.push(review);
      await this.userRepository.save(user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'can not create review to podcast' };
    }
  }

  async subscribeToPodcast(
    userId: number,
    podcastId: number,
  ): Promise<SubscribePodcastOutput> {
    try {
      const user = await this.userRepository.findOneOrFail(userId, {
        relations: ['subscriptions'],
      });
      const podcast = await this.podcastRepository.findOneOrFail(podcastId);
      user.subscriptions.push(podcast);
      await this.userRepository.save(user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'can not subscribe to podcast' };
    }
  }

  async seeSubscriptions(userId: number): Promise<SeeSubscriptionsOutput> {
    try {
      const user = await this.userRepository.findOneOrFail(userId, {
        relations: ['subscriptions'],
      });
      const subscriptions = user.subscriptions;
      return { ok: true, subscriptions };
    } catch (error) {
      return { ok: false, error: 'can not see subscriptions' };
    }
  }

  async markEpisodeAsPlayed(
    userId: number,
    episodeId: number,
  ): Promise<MarkEpisodeOutput> {
    try {
      const user = await this.userRepository.findOneOrFail(userId, {
        relations: ['markEpisode'],
      });
      const episode = await this.episodeRepository.findOneOrFail(episodeId);
      const episodes = user.markEpisode;
      episodes.push(episode);

      await this.userRepository.save(user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'can not mark episode' };
    }
  }
}
