
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/library.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}




  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  password: 'password',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lecturerCenterId: 'lecturerCenterId',
  departmentId: 'departmentId'
};

exports.Prisma.CenterScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  coordinatorId: 'coordinatorId'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  centerId: 'centerId'
};

exports.Prisma.ClaimScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  amount: 'amount',
  status: 'status',
  submittedAt: 'submittedAt',
  updatedAt: 'updatedAt',
  processedAt: 'processedAt',
  submittedById: 'submittedById',
  centerId: 'centerId',
  processedById: 'processedById'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  password: 'password',
  lecturerCenterId: 'lecturerCenterId',
  departmentId: 'departmentId'
};

exports.Prisma.CenterOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  coordinatorId: 'coordinatorId'
};

exports.Prisma.DepartmentOrderByRelevanceFieldEnum = {
  id: 'id',
  name: 'name',
  centerId: 'centerId'
};

exports.Prisma.ClaimOrderByRelevanceFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  submittedById: 'submittedById',
  centerId: 'centerId',
  processedById: 'processedById'
};
exports.Role = exports.$Enums.Role = {
  REGISTRY: 'REGISTRY',
  COORDINATOR: 'COORDINATOR',
  LECTURER: 'LECTURER'
};

exports.ClaimStatus = exports.$Enums.ClaimStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Center: 'Center',
  Department: 'Department',
  Claim: 'Claim'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\nanas\\Downloads\\key\\key\\lib\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\nanas\\Downloads\\key\\key\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "6.6.0",
  "engineVersion": "f676762280b54cd07c770017ed3711ddde35f37a",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "mysql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../lib/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"mysql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// --- Enums ---\n\n// Enum for user roles to clearly define capabilities\nenum Role {\n  REGISTRY // Super Admin\n  COORDINATOR // Manages a specific Center\n  LECTURER // Submits claims within a Center\n}\n\n// Enum for Claim Status to track the lifecycle of a claim\nenum ClaimStatus {\n  PENDING // Submitted, awaiting review\n  APPROVED // Reviewed and approved by Coordinator\n  REJECTED // Reviewed and rejected by Coordinator\n}\n\n// --- Models ---\n\n// User model: Represents all individuals interacting with the system\nmodel User {\n  id        String   @id @default(cuid()) // Unique ID (e.g., cl...)\n  email     String   @unique // Login email, must be unique across all users\n  name      String? // User's full name (optional)\n  password  String // Hashed password for security\n  role      Role // Role assigned to the user (REGISTRY, COORDINATOR, LECTURER)\n  createdAt DateTime @default(now()) // When the user account was created\n  updatedAt DateTime @updatedAt // When the user account was last updated\n\n  // --- Relationships ---\n\n  // If the user is a Coordinator (role == COORDINATOR), they manage one Center.\n  // The relation is named \"CenterCoordinator\".\n  // The '?' means a User doesn't *have* to be a coordinator of a center.\n  coordinatedCenter Center? @relation(\"CenterCoordinator\")\n\n  // If the user is a Lecturer (role == LECTURER), they belong to one Center.\n  // The relation is named \"CenterLecturers\".\n  // The '?' indicates a lecturer might not be assigned to a center initially (though unlikely in practice).\n  lecturerCenter   Center? @relation(\"CenterLecturers\", fields: [lecturerCenterId], references: [id])\n  lecturerCenterId String? // Foreign key linking to the Center's id. Nullable.\n\n  // If the user is a Lecturer (role == LECTURER), they belong to one Department within their Center.\n  // The relation is named \"DepartmentLecturers\".\n  department   Department? @relation(\"DepartmentLecturers\", fields: [departmentId], references: [id])\n  departmentId String? // Foreign key linking to the Department's id. Nullable.\n\n  // If the user is a Lecturer (role == LECTURER), they can submit multiple Claims.\n  // The relation is named \"LecturerClaims\".\n  submittedClaims Claim[] @relation(\"LecturerClaims\")\n\n  // If the user is a Coordinator (role == COORDINATOR), they can process (approve/reject) multiple Claims.\n  // The relation is named \"CoordinatorClaims\".\n  processedClaims Claim[] @relation(\"CoordinatorClaims\")\n\n  // --- Indexes ---\n  // Add indexes for faster lookups on foreign keys often used in queries\n  @@index([lecturerCenterId])\n  @@index([departmentId])\n}\n\n// Center model: Represents a physical or logical center managed by a Coordinator\nmodel Center {\n  id        String   @id @default(cuid()) // Unique ID for the center\n  name      String   @unique // Name of the center, must be unique\n  createdAt DateTime @default(now()) // When the center was created\n  updatedAt DateTime @updatedAt // When the center was last updated\n\n  // --- Relationships ---\n\n  // Each Center MUST have exactly one Coordinator (User).\n  // This uses the other side of the \"CenterCoordinator\" relation defined in User.\n  coordinator   User   @relation(\"CenterCoordinator\", fields: [coordinatorId], references: [id])\n  // The coordinatorId field stores the ID of the User who is the coordinator.\n  // It's marked @unique to enforce the one-to-one relationship (one user per center as coordinator).\n  coordinatorId String @unique\n\n  // Each Center can have many Lecturers (Users).\n  // This uses the other side of the \"CenterLecturers\" relation defined in User.\n  lecturers User[] @relation(\"CenterLecturers\")\n\n  // Each Center can contain multiple Departments.\n  // This uses the \"CenterDepartments\" relation.\n  departments Department[] @relation(\"CenterDepartments\")\n\n  // Each Center is associated with multiple Claims (submitted by its lecturers).\n  // This uses the \"CenterClaims\" relation.\n  claims Claim[] @relation(\"CenterClaims\")\n}\n\n// Department model: Represents a department within a specific Center\nmodel Department {\n  id        String   @id @default(cuid()) // Unique ID for the department\n  name      String // Name of the department (e.g., \"Computer Science\")\n  createdAt DateTime @default(now()) // When the department was created\n  updatedAt DateTime @updatedAt // When the department was last updated\n\n  // --- Relationships ---\n\n  // Each Department MUST belong to exactly one Center.\n  // This uses the other side of the \"CenterDepartments\" relation defined in Center.\n  center   Center @relation(\"CenterDepartments\", fields: [centerId], references: [id], onDelete: Cascade) // If Center deleted, delete Department\n  centerId String // Foreign key linking to the Center's id\n\n  // Each Department can have many Lecturers (Users) assigned to it.\n  // This uses the other side of the \"DepartmentLecturers\" relation defined in User.\n  lecturers User[] @relation(\"DepartmentLecturers\")\n\n  // --- Constraints & Indexes ---\n  // Ensure department names are unique *within* the same center.\n  @@unique([name, centerId])\n  // Index for faster lookups based on the center.\n  @@index([centerId])\n}\n\n// Claim model: Represents a claim submitted by a Lecturer\nmodel Claim {\n  id          String      @id @default(cuid()) // Unique ID for the claim\n  title       String // A short title for the claim\n  description String?     @db.Text // Optional longer description (using TEXT type in DB)\n  amount      Float // The monetary amount being claimed\n  status      ClaimStatus @default(PENDING) // Default status is PENDING upon creation\n  submittedAt DateTime    @default(now()) // Timestamp when the claim was created/submitted\n  updatedAt   DateTime    @updatedAt // Timestamp of the last update (e.g., status change)\n  processedAt DateTime? // Timestamp when a Coordinator approved/rejected it (optional)\n\n  // --- Relationships ---\n\n  // Each Claim MUST be submitted by exactly one Lecturer (User).\n  // This uses the other side of the \"LecturerClaims\" relation defined in User.\n  submittedBy   User   @relation(\"LecturerClaims\", fields: [submittedById], references: [id], onDelete: Cascade) // If Lecturer deleted, delete their claims\n  submittedById String // Foreign key linking to the submitting User's id\n\n  // Each Claim MUST belong to one Center. This simplifies filtering claims by center for Coordinators.\n  // This uses the \"CenterClaims\" relation.\n  center   Center @relation(\"CenterClaims\", fields: [centerId], references: [id], onDelete: Cascade) // If Center deleted, delete its claims\n  centerId String // Foreign key linking to the Center's id\n\n  // Each Claim *can* be processed (approved/rejected) by one Coordinator (User).\n  // This uses the other side of the \"CoordinatorClaims\" relation defined in User.\n  // The '?' means this relationship is optional (null until processed).\n  processedBy   User?   @relation(\"CoordinatorClaims\", fields: [processedById], references: [id], onDelete: SetNull) // If Coordinator deleted, set processedById to null\n  processedById String? // Foreign key linking to the processing User's id. Nullable.\n\n  // --- Indexes ---\n  // Add indexes for faster lookups on fields frequently used in queries/filters\n  @@index([submittedById])\n  @@index([centerId])\n  @@index([processedById])\n  @@index([status])\n}\n",
  "inlineSchemaHash": "b4fe0f7c11a42e8d48a0f4baf5f5c5e1f26be65e923a5847ba93940e591780d3",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "lib/generated/prisma",
    "generated/prisma",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Role\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"coordinatedCenter\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Center\",\"nativeType\":null,\"relationName\":\"CenterCoordinator\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lecturerCenter\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Center\",\"nativeType\":null,\"relationName\":\"CenterLecturers\",\"relationFromFields\":[\"lecturerCenterId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lecturerCenterId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"department\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Department\",\"nativeType\":null,\"relationName\":\"DepartmentLecturers\",\"relationFromFields\":[\"departmentId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"departmentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"submittedClaims\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Claim\",\"nativeType\":null,\"relationName\":\"LecturerClaims\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processedClaims\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Claim\",\"nativeType\":null,\"relationName\":\"CoordinatorClaims\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Center\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"coordinator\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"CenterCoordinator\",\"relationFromFields\":[\"coordinatorId\"],\"relationToFields\":[\"id\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"coordinatorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lecturers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"CenterLecturers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"departments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Department\",\"nativeType\":null,\"relationName\":\"CenterDepartments\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"claims\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Claim\",\"nativeType\":null,\"relationName\":\"CenterClaims\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Department\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"center\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Center\",\"nativeType\":null,\"relationName\":\"CenterDepartments\",\"relationFromFields\":[\"centerId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"centerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lecturers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"DepartmentLecturers\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"name\",\"centerId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"name\",\"centerId\"]}],\"isGenerated\":false},\"Claim\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ClaimStatus\",\"nativeType\":null,\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"submittedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"processedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"submittedBy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"LecturerClaims\",\"relationFromFields\":[\"submittedById\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"submittedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"center\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Center\",\"nativeType\":null,\"relationName\":\"CenterClaims\",\"relationFromFields\":[\"centerId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"centerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processedBy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"CoordinatorClaims\",\"relationFromFields\":[\"processedById\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"processedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"Role\":{\"values\":[{\"name\":\"REGISTRY\",\"dbName\":null},{\"name\":\"COORDINATOR\",\"dbName\":null},{\"name\":\"LECTURER\",\"dbName\":null}],\"dbName\":null},\"ClaimStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"APPROVED\",\"dbName\":null},{\"name\":\"REJECTED\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined
config.compilerWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "lib/generated/prisma/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "lib/generated/prisma/schema.prisma")
