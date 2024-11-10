import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const db = SQLite.openDatabase(
  {
    name: 'EversPass.db',
    location: 'default',
  },
  () => console.log('Database opened'),
  (error) => console.log('Error opening database', error)
);

const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT,
        password_hash TEXT,
        role TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS password_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        security_type TEXT,
        title TEXT,
        username TEXT,
        password TEXT,
        website TEXT,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS credit_card_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        security_type TEXT,
        title TEXT,
        cardholder TEXT,
        card_number TEXT,
        expiration_date TEXT,
        cvv TEXT,
        zip_code TEXT,
        website TEXT,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS personal_info_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        security_type TEXT,
        title TEXT,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone TEXT,
        website TEXT,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS secure_note_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        security_type TEXT,
        title TEXT,
        note TEXT,
        website TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS custom_fields (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        value TEXT,
        data_type TEXT,
        data_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    );

    console.log('Tables created successfully');
  });
};

const initializeDatabase = async () => {
  const isDatabaseInitialized = await AsyncStorage.getItem('isDatabaseInitialized');

  if (!isDatabaseInitialized) {
    // createTables(); // Uncomment when ready for use
    await AsyncStorage.setItem('isDatabaseInitialized', 'true');
    console.log('Database initialized for the first time');
  } else {
    console.log('Database already initialized');
  }
};

// Call this function in your main component's initialization
initializeDatabase();




// Table users {
//   id integer [primary key]
//   username varchar
//   email varchar
//   password_hash varchar
//   role varchar
//   created_at timestamp
//   modified_at timestamp
// }

// Table password_data {
//   id integer [primary key]
//   user_id integer [ref: > users.id]
//   security_type varchar
//   title varchar
//   username varchar
//   password varchar
//   website varchar
//   note text
//   created_at timestamp
//   modified_at timestamp
// }

// Table credit_card_data {
//   id integer [primary key]
//   user_id integer [ref: > users.id]
//   security_type varchar
//   title varchar
//   cardholder varchar
//   card_number varchar
//   expiration_date varchar
//   cvv varchar
//   zip_code varchar
//   website varchar
//   note text
//   created_at timestamp
//   modified_at timestamp
// }

// Table personal_info_data {
//   id integer [primary key]
//   user_id integer [ref: > users.id]
//   security_type varchar
//   title varchar
//   first_name varchar
//   last_name varchar
//   email varchar
//   phone varchar
//   website varchar
//   note text
//   created_at timestamp
//   modified_at timestamp
// }

// Table secure_note_data {
//   id integer [primary key]
//   user_id integer [ref: > users.id]
//   security_type varchar
//   title varchar
//   note text
//   website varchar
//   created_at timestamp
//   modified_at timestamp
// }

// Table custom_fields {
//   id integer [primary key]
//   name varchar
//   value varchar
//   data_type varchar // Indicates the type of related data (PasswordData, CreditCardData, etc.)
//   data_id integer   // ID of the related data record
//   created_at timestamp
//   modified_at timestamp
// }

// Ref: password_data.id < custom_fields.data_id
// Ref: credit_card_data.id < custom_fields.data_id
// Ref: personal_info_data.id < custom_fields.data_id
// Ref: secure_note_data.id < custom_fields.data_id
