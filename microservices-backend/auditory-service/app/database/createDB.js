import { Sequelize } from "sequelize";
import dbconfig from "./config.js";
import { SequelizeStorage, Umzug } from "umzug";

let sequelizeOptions = {
  dialect: "postgres",
  host: dbconfig.host,
  username: dbconfig.username,
  password: dbconfig.password,
};

const dataBase = async () => {
  // create db if it doesn't already exist
  const database = dbconfig.database;

  try {
    const sequelizeCont = await new Sequelize(sequelizeOptions).getQueryInterface().createDatabase(database);
    return sequelizeCont;
  } catch {
    return new Sequelize({
      dialect: "postgres",
      host: dbconfig.host,
      username: dbconfig.username,
      password: dbconfig.password,
      database: dbconfig.database,
      logging: false,
    });
  }
};

const sequelizeCreate = await dataBase();

//if the database is created, we need to close the connection and create a new one
const sequelize = await dataBase();

async function syncDatabase(sequelizeDb) {
  try {
    const umzug = new Umzug({
      migrations: {
        glob: "migrations/*.js",
        resolve: ({ name, path, context }) => {
          const getMigration = () => import(path);
          return {
            // adjust the parameters Umzug will
            // pass to migration methods when called
            name,
            up: async () => (await getMigration()).up(context, Sequelize),
            down: async () => (await getMigration()).down(context, Sequelize),
          };
        },
      },
      storage: new SequelizeStorage({ sequelize: sequelizeDb }),
      context: sequelizeDb.getQueryInterface(),
      logger: console,
    });
    const migrations = await umzug.executed();

    console.log(`Applied migrations: ${migrations.length}`);
    await umzug.up();

    // const down = await umzug.down({ migrations: ["20260415104931-create-auditory.js"] });
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Error creating database:", error);
  }
}

syncDatabase(sequelize);

export default sequelize;
