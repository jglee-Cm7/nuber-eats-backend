import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Verification } from "./entities/verification.entity";
import { UsersService } from "./users.service";

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
})

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token-baby'),
  verify: jest.fn(),
})

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository;
  let verificationsRepository: MockRepository;
  let jwtService: JwtService;

  // Testing Module
  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [UsersService, 
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        }, 
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        }, 
        {
          provide: JwtService,
          useValue: mockJwtService()
        }]
    }).compile();
    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
    verificationsRepository = module.get(getRepositoryToken(Verification));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  // createAccount Function Test
  describe("createAccount", () => {
    const createAccountArgs = {
      email: 'test@test.com',
      password: '12345',
      role: 0,
    }
    // case 1
    it("should fail if user exists", async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toMatchObject({ ok: false, error: 'There is a user with that email already'});
    })

    // case 2
    it("should create a new user", async() => {
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArgs);
      usersRepository.save.mockResolvedValue(createAccountArgs);
      verificationsRepository.create.mockReturnValue({user: createAccountArgs});

      const result = await service.createAccount(createAccountArgs);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

      expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs
      });

      expect(result).toEqual({ ok: true });
    })

    // case 3
    it("should fail on exception", async() => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual({ ok: false, error: "Couldn't create account" });
    })

  })

  // test 할 todo
  describe("login", () => {
    const loginArgs = {
      email: 'test@test.com',
      password: '12345'
    }

    it("should fail if user does not exist", async() => {
      usersRepository.findOne.mockResolvedValue(null);

      const result = await service.login(loginArgs);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
      expect(result).toEqual({ok: false, error: 'User not found'});
    })

    it("should fail if the password is wrong", async() => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false))
      }
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({ok: false, error: 'Wrong password'});
    })

    it("should return token if password correct", async() => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true))
      }
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual({ ok: true, token: 'signed-token-baby' });
    })

    it("should fail on exception", async() => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login(loginArgs);
      expect(result).toEqual({ok: false, error: "Can't log user in"});
    })

  })

  describe("findById", () => {
    const findByIdArg = {
      id: 1
    };
    it("should find an existing user", async() => {
      usersRepository.findOneOrFail.mockResolvedValue(findByIdArg);
      const result = await service.findById(1);
      expect(result).toEqual({ ok: true, user: findByIdArg });
    })

    it("should fail if no user if found", async() => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findById(1);
      expect(result).toEqual({ ok: false, error: 'User Not Found' });
    })
  })

  describe("EditProfile", () => {
    it("should change email", async() => {
      const oldUser = {
        email: 'test@old.com',
        verified: true
      };
      const editProfileArgs = {
        userId: 1,
        input: {email: 'test@new.com'}
      };
      const newVerification = {
        code: 'code'
      };
      const newUser = {
        email: 'test@new.com',
        verified: false
      }

      usersRepository.findOne.mockResolvedValue(oldUser);
      verificationsRepository.create.mockReturnValue(newVerification);
      verificationsRepository.save.mockResolvedValue(newVerification);

      await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(editProfileArgs.userId);
      
      expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.create).toHaveBeenCalledWith({user: newUser});
      expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.save).toHaveBeenCalledWith(newVerification);
    })

    it("should change password", async() => {
      const editProfileArgs = {
        userId: 1,
        input: {password: 'new.password'}
      };

      usersRepository.findOne.mockResolvedValue({password: 'old' });
      const result = await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input);
      expect(result).toEqual({ok: true});
    })

    it("should fail on exception", async() => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.editProfile(1, { email: 'test' });
      expect(result).toEqual({ok: false, error: "Could not update profile"});
    })
  })

  describe('verifyEmail', () => {
    it("should verify email", async() => {
      const mockedVerification = {
        id: 1,
        user: {
          verified: false,
        }
      };
      verificationsRepository.findOne.mockResolvedValue(mockedVerification);
      const result = await service.verifyEmail('');

      expect(verificationsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.findOne).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith({verified: true});
      expect(verificationsRepository.delete).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.delete).toHaveBeenCalledWith(mockedVerification.id);
      expect(result).toEqual({ ok: true });

    })
    it("should fail on verification not found", async() => {
      verificationsRepository.findOne.mockResolvedValue(undefined);
      const result = await service.verifyEmail('');

      expect(verificationsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.findOne).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
      expect(result).toEqual({ok: false, error: 'Verified Failed!'});
    })
    it("should fail on exception", async() => {
      verificationsRepository.findOne.mockRejectedValue(new Error());
      const result = await service.verifyEmail('');

      expect(verificationsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.findOne).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
      expect(result).toEqual({ok: false, error: 'Could not verify email'});
    })
  });
});
