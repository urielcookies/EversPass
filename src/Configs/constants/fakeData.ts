export default [
	{
    id: 1,
    securityType: 'PASSWORD',
    title: 'John',
    passData: {
      username: 'john@example.com',
      password: 'react-native-better-than-flutter',
      website: 'google.com',
      note: 'No Comment Here',
      customFields: [
        {
          alternativeEmail: 'whatup@ever.com'
        }
      ]
    }
  },
  {
    id: 2,
    securityType: 'PASSWORD',
    title: 'Sarah',
    passData: {
      username: 'sarah@example.com',
      password: 'javascript-is-fun',
      website: 'facebook.com',
      note: 'Remember to logout',
      customFields: [
        {
          birthday: '1985-05-21'
        }
      ]
    }
  },
  {
    id: 3,
    securityType: 'SECURENOTE',
    title: 'Secret',
    passData: {
      note: 'I love pizza',
      customFields: [
        {
          category: 'Food'
        }
      ]
    }
  },
  {
    id: 4,
    securityType: 'CREDITCARD',
    title: 'Visa 3',
    passData: {
      cardholder: 'John Doe',
      cardNumber: '1234 5678 9012 3456',
      expirationDate: '12/24',
			CVV: '123',
			zipCode: '87144',
      customFields: [
        {
          cardType: 'Visa'
        }
      ]
    }
  },
  {
    id: 5,
    securityType: 'PERSONALINFO',
    title: 'Profile',
    passData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      customFields: [
        {
          gender: 'Male'
        }
      ]
    }
  },
  {
    id: 6,
    securityType: 'FOLDER',
    title: 'Work',
    passData: {}
  },
  {
    id: 7,
    securityType: 'PASSWORD',
    title: 'Dropbox',
    passData: {
      username: 'john@example.com',
      password: 'my-dropbox-password',
      website: 'dropbox.com',
      note: 'Don\'t share with anyone',
      customFields: [
        {
          storageCapacity: '2 TB'
        }
      ]
    }
  },
  {
    id: 8,
    securityType: 'PASSWORD',
    title: 'Gmail',
    passData: {
      username: 'john@example.com',
      password: 'my-gmail-password',
      website: 'gmail.com',
      note: 'Enable 2FA',
      customFields: [
        {
          emailAlias: 'john.doe@gmail.com'
        }
      ]
    }
  },
  {
    id: 9,
    securityType: 'SECURENOTE',
    title: 'Journal',
    passData: {
      note: 'Dear Diary...',
      customFields: [
        {
          category: 'Personal'
        }
      ]
    }
  },
  {
    id: 10,
    securityType: 'CREDITCARD',
    title: 'Mastercard',
    passData: {
      cardholder: 'John Doe',
      cardNumber: '9876 5432 1098 7654',
      expirationDate: '06/26',
			CVV: '123',
			zipCode: '91331',
      customFields: [
        {
          cardType: 'Mastercard'
        }
      ]
    }
  },
	{
    id: 11,
    securityType: 'PASSWORD',
    title: 'Twitter',
    passData: {
      username: 'johndoe',
      password: 'my-twitter-password',
      website: 'twitter.com',
      note: 'Tweet responsibly',
      customFields: [
        {
          followers: '1000+'
        }
      ]
    }
  },
  {
    id: 12,
    securityType: 'PASSWORD',
    title: 'LinkedIn',
    passData: {
      username: 'johndoe',
      password: 'my-linkedin-password',
      website: 'linkedin.com',
      note: 'Keep profile updated',
      customFields: [
        {
          industry: 'IT'
        }
      ]
    }
  },
  {
    id: 13,
    securityType: 'PERSONALINFO',
    title: 'Resume',
    passData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      customFields: [
        {
          skills: 'JavaScript, React, Node.js'
        }
      ]
    }
  },
  {
    id: 14,
    securityType: 'SECURENOTE',
    title: 'Diary',
    passData: {
      note: 'Today was a good day',
      customFields: [
        {
          category: 'Personal'
        }
      ]
    }
  },
  {
    id: 15,
    securityType: 'CREDITCARD',
    title: 'Amex',
    passData: {
      cardholder: 'John Doe',
      cardNumber: '3456 7890 1234 5678',
      expirationDate: '09/27',
			CVV: '123',
			zipCode: '87123',
      website: 'amex.com',
      customFields: [
        {
          cardType: 'Amex'
        }
      ]
    }
  },
  {
    id: 16,
    securityType: 'PASSWORD',
    title: 'GitHub',
    passData: {
      username: 'johndoe',
      password: 'my-github-password',
      website: 'github.com',
      note: 'Push code daily',
      customFields: [
        {
          publicRepos: '10+'
        }
      ]
    }
  },
  {
    id: 17,
    securityType: 'PASSWORD',
    title: 'Instagram',
    passData: {
      username: 'johndoe',
      password: 'my-instagram-password',
      website: 'instagram.com',
      note: 'Post photos occasionally',
      customFields: [
        {
          followers: '500+'
        }
      ]
    }
  },
  {
    id: 18,
    securityType: 'FOLDER',
    title: 'Personal',
    passData: {}
  },
  {
    id: 19,
    securityType: 'PASSWORD',
    title: 'Amazon',
    passData: {
      username: 'johndoe',
      password: 'my-amazon-password',
      website: 'amazon.com',
      note: 'Use prime for free shipping',
      customFields: [
        {
          wishList: 'Books, Gadgets'
        }
      ]
    }
  },
	{
    id: 21,
    securityType: 'CREDITCARD',
    title: 'Visa (Bank Of America)',
    passData: {
      cardholder: 'John Doe',
      cardNumber: '1234 5678 9012 3456',
      expirationDate: '12/24',
			CVV: '123',
			zipCode: '91234',
      customFields: [
        {
          cardType: 'Visa'
        }
      ]
    }
  },
  {
    id: 22,
    securityType: 'SECURENOTE',
    title: 'Secret Recipe',
    passData: {
      note: '1 cup sugar, 2 cups flour, 3 eggs...',
      customFields: [
        {
          category: 'Recipes'
        }
      ]
    }
  },
  {
    id: 23,
    securityType: 'PASSWORD',
    title: 'Dropbox (from work)',
    passData: {
      username: 'johndoe',
      password: 'my-dropbox-password',
      website: 'dropbox.com',
      note: 'Sync files across devices',
      customFields: [
        {
          storageSpace: '2TB'
        }
      ]
    }
  },
  {
    id: 24,
    securityType: 'PASSWORD',
    title: 'Slack',
    passData: {
      username: 'johndoe',
      password: 'my-slack-password',
      website: 'slack.com',
      note: 'Collaborate with team members',
      customFields: [
        {
          channels: 'general, random'
        }
      ]
    }
  },
	{
    id: 26,
    securityType: 'PASSWORD',
    title: 'Netflix',
    passData: {
      username: 'johndoe',
      password: 'my-netflix-password',
      website: 'netflix.com',
      note: 'Binge-watch on weekends',
      customFields: [
        {
          plan: 'Premium'
        }
      ]
    }
  },
]