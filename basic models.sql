CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  role TINYINT NOT NULL,  -- 0 for customer, 1 for admin
  name NVARCHAR(50) NOT NULL,
  email NVARCHAR(50) NOT NULL UNIQUE,
  `passwordHash` NVARCHAR(60) NOT NULL,
  beerWinAmount SMALLINT NOT NULL,
  beerGameAmount MEDIUMINT NOT NULL,
  rockPaperScissorsWinAmount MEDIUMINT NOT NULL,
  rockPaperScissorsGameAmount INT NOT NULL
);

CREATE TABLE connections (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  userId CHAR(36) NOT NULL,
  signalrId NVARCHAR(22) NOT NULL,
  timeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);