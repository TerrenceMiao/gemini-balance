describe('validateConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Clears the cache
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('throws if both API keys are missing', () => {
    process.env.GEMINI_API_KEY = '';
    process.env.OPENAI_API_KEY = '';
    expect(() => {
      require('../index').validateConfig();
    }).toThrow(/GEMINI_API_KEY or OPENAI_API_KEY/);
  });

  it('throws if PORT is invalid', () => {
    process.env.GEMINI_API_KEY = 'dummy';
    process.env.PORT = 'notanumber';
    expect(() => {
      require('../index').validateConfig();
    }).toThrow(/PORT/);
  });

  it('throws if GEMINI_API_TIMEOUT is invalid', () => {
    process.env.GEMINI_API_KEY = 'dummy';
    process.env.PORT = '3000';
    process.env.GEMINI_API_TIMEOUT = 'abc';
    expect(() => {
      require('../index').validateConfig();
    }).toThrow(/GEMINI_API_TIMEOUT/);
  });

  it('does not throw for valid config', () => {
    process.env.GEMINI_API_KEY = 'dummy';
    process.env.PORT = '3000';
    process.env.GEMINI_API_TIMEOUT = '30000';
    expect(() => {
      require('../index').validateConfig();
    }).not.toThrow();
  });
}); 