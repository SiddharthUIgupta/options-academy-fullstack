const tutorialData = [
  {
    id: 'module-1',
    title: 'Phase 1: Market Foundations',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Market Mechanics & Exchanges',
        content: `Financial markets are ecosystems where buyers and sellers trade assets. Options are primarily traded on regulated exchanges like the CBOE (Chicago Board Options Exchange). 

Key Concepts:
- **Exchanges:** Centralized locations (like NYSE or NASDAQ) where trades are matched.
- **Liquidity:** The ease with which an asset can be bought or sold. High liquidity ensures narrow Bid-Ask spreads, which is vital for options.
- **Regulation:** Organizations like the SEC and FINRA oversee markets to ensure fairness and transparency.`,
        quiz: {
          question: 'Why is high liquidity important for options traders?',
          options: [
            'It makes the stock price go up faster',
            'It ensures you can enter and exit trades easily with narrow spreads',
            'It guarantees a profit on every trade',
            'It prevents the stock from ever crashing'
          ],
          correctAnswer: 1
        }
      },
      {
        id: 'lesson-2',
        title: 'Bull vs. Bear Markets',
        content: `The direction of the overall market significantly impacts individual option prices.

- **Bull Market:** A period of rising prices and investor optimism.
- **Bear Market:** A period of falling prices (usually 20% or more from recent highs) and pessimism.
- **Market Correction:** A short-term decline of at least 10%, often seen as a healthy "reset" during a bull market.`,
        quiz: {
          question: 'What defines a formal "Bear Market"?',
          options: [
            'A 5% drop in prices',
            'A 10% drop in prices',
            'A 20% or greater drop in prices',
            'Any day the market ends in the red'
          ],
          correctAnswer: 2
        }
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Phase 2: Options Fundamentals',
    lessons: [
      {
        id: 'lesson-3',
        title: 'The Anatomy of a Contract',
        content: `Every options contract has four fixed components:
1. **Underlying Asset:** The stock or ETF the option is based on (e.g., TSLA).
2. **Type:** Either a Call or a Put.
3. **Strike Price:** The price at which the contract can be exercised.
4. **Expiration Date:** The date the contract expires and becomes worthless.

Remember: 1 standard contract = 100 shares of the underlying stock.`,
        quiz: {
          question: 'If you see an option quoted at $1.50, how much does it actually cost to buy?',
          options: [
            '$1.50',
            '$15.00',
            '$150.00',
            '$1,500.00'
          ],
          correctAnswer: 2
        }
      },
      {
        id: 'lesson-4',
        title: 'Calls vs. Puts',
        content: `**Call Options:** Give the buyer the right to BUY stock. You are bullish.
**Put Options:** Give the buyer the right to SELL stock. You are bearish.

- **Buying a Call:** You want the stock to go UP.
- **Selling a Call:** You want the stock to stay BELOW the strike.
- **Buying a Put:** You want the stock to go DOWN.
- **Selling a Put:** You want the stock to stay ABOVE the strike.`,
        quiz: {
          question: 'If you expect Apple (AAPL) stock to crash next week, which contract would you likely BUY?',
          options: [
            'Call Option',
            'Put Option',
            'A share of stock',
            'Nothing'
          ],
          correctAnswer: 1
        }
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Phase 3: Pricing & Moneyness',
    lessons: [
      {
        id: 'lesson-5',
        title: 'Intrinsic vs. Extrinsic Value',
        content: `Option Premium = Intrinsic Value + Extrinsic Value.

- **Intrinsic Value:** The amount of "real" value in the contract. If a $100 Call exists and the stock is $105, the intrinsic value is $5.
- **Extrinsic Value:** Also called "Time Value." It represents the possibility of the stock moving further before expiration. This value decays every day.`,
        quiz: {
          question: 'Which component of an option price decays as the expiration date approaches?',
          options: [
            'Intrinsic Value',
            'Strike Price',
            'Extrinsic Value',
            'Dividends'
          ],
          correctAnswer: 2
        }
      },
      {
        id: 'lesson-6',
        title: 'Moneyness: ITM, OTM, ATM',
        content: `- **In-the-Money (ITM):** The option has intrinsic value.
- **Out-of-the-Money (OTM):** The option has NO intrinsic value, only extrinsic.
- **At-the-Money (ATM):** The strike price is exactly the same as the stock price.

Most traders sell OTM options to collect premium and buy ITM options for higher directional exposure.`,
        quiz: {
          question: 'If a Put option has a strike of $50 and the stock is at $60, what is its moneyness?',
          options: [
            'In-the-Money (ITM)',
            'At-the-Money (ATM)',
            'Out-of-the-Money (OTM)',
            'Deep In-the-Money'
          ],
          correctAnswer: 2
        }
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Phase 4: The Greeks',
    lessons: [
      {
        id: 'lesson-7',
        title: 'Delta: Price Sensitivity',
        content: `Delta measures how much an option's price changes for every $1 move in the stock.
- Calls have positive Delta (0 to 1).
- Puts have negative Delta (0 to -1).

Delta is also used as a proxy for the probability (e.g., a 0.16 Delta option has roughly a 16% chance of expiring ITM).`,
        quiz: {
          question: 'If an option has a Delta of 0.50 and the stock moves up by $2.00, how much should the option price increase?',
          options: [
            '$0.50',
            '$1.00',
            '$2.00',
            '$5.00'
          ],
          correctAnswer: 1
        }
      },
      {
        id: 'lesson-8',
        title: 'Theta: The Silent Killer',
        content: `Theta represents "Time Decay." It is the amount an option's price decreases each day as it gets closer to expiration.
- Theta is always working AGAINST the buyer.
- Theta is always working FOR the seller.
- Decay accelerates significantly in the last 30-45 days.`,
        quiz: {
          question: 'Who benefits from Theta (Time Decay)?',
          options: [
            'The Option Buyer',
            'The Option Seller',
            'The Market Maker',
            'The Stock Holder'
          ],
          correctAnswer: 1
        }
      },
      {
        id: 'lesson-9',
        title: 'Vega: Volatility Risk',
        content: `Vega measures sensitivity to changes in Implied Volatility (IV). 
- If IV goes UP, option prices go UP (Vega helps you if you are long).
- If IV goes DOWN, option prices go DOWN (IV Crush).
Vega is highest for At-the-Money options with a long time until expiration.`,
        quiz: {
          question: 'What happens to option premiums during an "IV Crush" after an earnings report?',
          options: [
            'Premiums increase',
            'Premiums stay the same',
            'Premiums decrease significantly',
            'The stock stops trading'
          ],
          correctAnswer: 2
        }
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Phase 5: Technical Analysis',
    lessons: [
      {
        id: 'lesson-10',
        title: 'Support and Resistance',
        content: `Technical analysis involves looking at past price action to predict future moves.
- **Support:** A price level where a stock tends to stop falling and "bounce" back up.
- **Resistance:** A price level where a stock tends to stop rising and "pull back."
Options traders use these levels to pick strike prices for their spreads.`,
        quiz: {
          question: 'What do you call a price level that a stock struggles to break ABOVE?',
          options: [
            'Support',
            'Resistance',
            'The Floor',
            'The Breakout'
          ],
          correctAnswer: 1
        }
      },
      {
        id: 'lesson-11',
        title: 'Moving Averages & RSI',
        content: `- **SMA (Simple Moving Average):** The average price over a set period (e.g., 50 or 200 days).
- **RSI (Relative Strength Index):** A momentum oscillator that measures speed and change. Above 70 is "Overbought," below 30 is "Oversold."`,
        quiz: {
          question: 'An RSI reading of 85 typically suggests the stock is:',
          options: [
            'Oversold',
            'Fairly Valued',
            'Overbought',
            'Crashing'
          ],
          correctAnswer: 2
        }
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Phase 6: Advanced Strategies',
    lessons: [
      {
        id: 'lesson-12',
        title: 'Vertical Credit Spreads',
        content: `A credit spread involves selling an expensive option and buying a cheaper one further OTM.
- **Bull Put Spread:** Sell a Put, buy a lower Put. Bullish strategy.
- **Bear Call Spread:** Sell a Call, buy a higher Call. Bearish strategy.
Benefit: Defined risk and lower capital requirement.`,
        quiz: {
          question: 'What is a "Credit Spread"?',
          options: [
            'A trade where you pay money to enter',
            'A trade where you receive money upfront (a credit)',
            'A trade with unlimited risk',
            'A trade using only stocks'
          ],
          correctAnswer: 1
        }
      },
      {
        id: 'lesson-13',
        title: 'Iron Condors',
        content: `An Iron Condor is a non-directional strategy. You sell a Bear Call Spread AND a Bull Put Spread at the same time.
You profit if the stock stays WITHIN a specific range. You are betting on LOW volatility.`,
        quiz: {
          question: 'When would you use an Iron Condor?',
          options: [
            'When you expect a huge breakout',
            'When you expect the stock to crash',
            'When you expect the stock to stay in a sideways range',
            'When you are very bullish'
          ],
          correctAnswer: 2
        }
      }
    ]
  },
  {
    id: 'module-7',
    title: 'Phase 7: Psychology & Automation',
    lessons: [
      {
        id: 'lesson-14',
        title: 'Trading Psychology',
        content: `The biggest enemy of a trader is their own mind.
- **Loss Aversion:** The pain of losing $100 is twice as powerful as the joy of gaining $100.
- **FOMO:** Fear Of Missing Out leads to bad entries.
- **Revenge Trading:** Trying to "win back" losses by taking bigger, riskier bets.`,
        quiz: {
          question: 'What is "Revenge Trading"?',
          options: [
            'Trading against someone you dislike',
            'Taking risky trades to quickly recover a previous loss',
            'Trading only during bear markets',
            'A professional hedging strategy'
          ],
          correctAnswer: 1
        }
      },
      {
        id: 'lesson-15',
        title: 'The Power of Automation',
        content: `Bots (like our Smart Advisor) help remove emotion from trading.
- **Rules-Based:** Automation follows your plan without hesitation.
- **Consistency:** Bots don't get tired or scared.
- **Speed:** Bots can scan thousands of contracts in milliseconds.`,
        quiz: {
          question: 'What is the primary benefit of using a trading bot/advisor?',
          options: [
            'It guarantees 100% wins',
            'It removes emotional bias and ensures rule consistency',
            'It eliminates the need for any paper money',
            'It makes the market less volatile'
          ],
          correctAnswer: 1
        }
      }
    ]
  }
];

module.exports = tutorialData;
