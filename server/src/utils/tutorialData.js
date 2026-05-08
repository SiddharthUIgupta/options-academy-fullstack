const tutorialData = [
  {
    id: 'module-1',
    title: 'Introduction to Options',
    lessons: [
      {
        id: 'lesson-1',
        title: 'What is an Option?',
        content: 'An option is a financial derivative that represents a contract sold by one party (the option writer) to another party (the option holder)...',
        quiz: {
          question: 'What is the primary difference between an option and a stock?',
          options: [
            'Options represent ownership, stocks do not.',
            'Options represent a right but not an obligation to buy/sell.',
            'Stocks have an expiration date, options do not.'
          ],
          correctAnswer: 1
        }
      },
      {
        id: 'lesson-2',
        title: 'Calls vs. Puts',
        content: 'A call option gives the holder the right to buy... A put option gives the holder the right to sell...',
        quiz: {
          question: 'If you expect a stock price to go UP, which option would you typically buy?',
          options: [
            'Call Option',
            'Put Option'
          ],
          correctAnswer: 0
        }
      }
    ]
  },
  {
    id: 'module-2',
    title: 'The Greeks',
    lessons: [
      {
        id: 'lesson-3',
        title: 'Delta and Gamma',
        content: 'Delta measures the rate of change of the option price relative to the stock price...',
        quiz: {
          question: 'Which Greek measures the sensitivity of Delta?',
          options: [
            'Theta',
            'Vega',
            'Gamma'
          ],
          correctAnswer: 2
        }
      }
    ]
  }
];

module.exports = tutorialData;
