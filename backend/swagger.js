import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'MERN Stack API',
      version: '1.0.0',
      description: 'API documentation for the MERN Stack application',
    },
    components: {
      schemas: {
        Action: {
          type: 'object',
          required: ['variable_id', 'control_Id'],
          properties: {
            fixed_id: {
              type: 'string',
              description: 'The fixed ID for the action',
            },
            variable_id: {
              type: 'string',
              description: 'The variable ID for the action',
            },
            control_Id: {
              type: 'string',
              description:
                'The ID of the associated control (referenced by ObjectId)',
            },
            product_family_Id: {
              type: 'string',
              description:
                'The product family ID associated with the action (referenced by ObjectId)',
            },
            softwareId: {
              type: 'string',
              description:
                'The software ID associated with the action (referenced by ObjectId)',
            },
            description: {
              type: 'string',
              description: 'Description of the action',
            },
            isDPDPA: {
              type: 'boolean',
              description: 'Whether the action is DPDPA-controlled',
            },
            isAction: {
              type: 'string',
              description: 'Whether the record represents an action',
            },
          },
        },

        Asset: {
          type: 'object',
          required: ['name', 'type'],
          properties: {
            name: { type: 'string', description: 'Name of the asset' },
            type: { type: 'string', description: 'Type of the asset' },
            desc: { type: 'string', description: 'Description of the asset' },
            isScoped: {
              type: 'boolean',
              description: 'Whether the asset is scoped',
            },
          },
        },
        AssetDetails: {
          type: 'object',
          required: ['asset', 'scoped'],
          properties: {
            asset: {
              type: 'string',
              description: 'Reference to the associated Asset (Asset ID)',
            },
            scoped: {
              type: 'string',
              description: 'Reference to the associated Scoped (Scoped ID)',
            },
            criticality: {
              type: 'string',
              description:
                'Criticality level of the asset (low, medium, high, critical)',
            },
            businessOwnerName: {
              type: 'string',
              description: 'Business Owner name',
            },
            businessOwnerEmail: {
              type: 'string',
              description: 'Business Owner email',
            },
            auditorName: { type: 'string', description: 'Auditor name' },
            auditorEmail: { type: 'string', description: 'Auditor email' },
            itOwnerName: { type: 'string', description: 'IT Owner name' },
            itOwnerEmail: { type: 'string', description: 'IT Owner email' },
            coverages: { type: 'number', description: 'Coverage count' },
          },
        },
        Assignment: {
          type: 'object',
          required: ['user', 'item', 'itemType'],
          properties: {
            user: {
              type: 'string',
              description: 'Reference to the assigned User (User ID)',
            },
            item: {
              type: 'string',
              description:
                'Reference to the assigned item (Training or Quiz ID)',
            },
            itemType: {
              type: 'string',
              enum: ['Training', 'Quiz'],
              description: 'Type of the assigned item',
            },
            status: {
              type: 'string',
              enum: ['Assigned', 'In Progress', 'Completed'],
              description: 'Status of the assignment',
            },
            score: {
              type: 'number',
              description: 'Applicable for quizzes (Score)',
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: 'Due date for the assignment',
            },
            completedAt: {
              type: 'string',
              format: 'date',
              description: 'Completion date of the assignment',
            },
            assignedAt: {
              type: 'string',
              format: 'date',
              description: 'Assignment creation date',
            },
          },
        },
        Business: {
          type: 'object',
          required: ['name', 'email', 'asset'],
          properties: {
            name: {
              type: 'string',
              description: 'Name of the business',
            },
            email: {
              type: 'string',
              description: 'Email address of the business',
            },
            asset: {
              type: 'string',
              description: 'Reference to the associated Asset (Asset ID)',
            },
          },
        },
        CompanyForm: {
          type: 'object',
          required: ['userId', 'phoneNumber', 'companyDetails'],
          properties: {
            userId: {
              type: 'string',
              description: 'Reference to the User ID',
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number of the user',
            },
            companyDetails: {
              type: 'object',
              properties: {
                organizationName: {
                  type: 'string',
                  description: 'Organization name',
                },
                industryType: {
                  type: 'string',
                  enum: ['Healthcare', 'Finance', 'Education', 'Others'],
                  description: 'Industry type of the company',
                },
                customIndustryType: {
                  type: 'string',
                  description:
                    'Custom industry type (only when Industry Type is Others)',
                },
                numberOfEmployees: {
                  type: 'string',
                  enum: ['0-10', '10-100', '100-10000', 'Others'],
                  description: 'Number of employees in the company',
                },
              },
            },
            otp: {
              type: 'string',
              description: 'OTP for verification',
            },
          },
        },
        CompletionStatus: {
          type: 'object',
          required: ['actionId', 'assetId', 'controlId', 'familyId'],
          properties: {
            actionId: {
              type: 'string',
              description: 'Reference to the associated Action (Action ID)',
            },
            assetId: {
              type: 'string',
              description: 'Reference to the associated Asset (Asset ID)',
            },
            scopeId: {
              type: 'string',
              description: 'Reference to the associated Scoped (Scoped ID)',
              nullable: true,
            },
            controlId: {
              type: 'string',
              description: 'Reference to the associated Control (Control ID)',
            },
            familyId: {
              type: 'string',
              description:
                'Reference to the associated Control Family (Control Family ID)',
            },
            selectedSoftware: {
              type: 'string',
              description: 'Reference to the selected Software (Software ID)',
              nullable: true,
            },
            isSoftwareSelected: {
              type: 'boolean',
              description: 'Indicates if software is selected',
            },
            isCompleted: {
              type: 'boolean',
              description: 'Whether the task is marked as completed',
            },
            isEvidenceUploaded: {
              type: 'boolean',
              description: 'Indicates if the evidence has been uploaded',
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the task was completed',
            },
            isTask: {
              type: 'boolean',
              description: 'Indicates whether the record represents a task',
            },
            createdBy: {
              type: 'string',
              description:
                'Reference to the user who created this record (User ID)',
            },
            AssignedBy: {
              type: 'string',
              description: 'Reference to the user who assigned this (User ID)',
            },
            AssignedTo: {
              type: 'string',
              description: 'Reference to the user assigned this task (User ID)',
            },
            status: {
              type: 'string',
              enum: [
                'Open',
                'Delegated to IT Team',
                'Evidence Uploaded',
                'Audit Delegated',
                'Not Applicable',
                'Not Applicable (Pending Auditor Confirmation)',
                'Wrong Evidence',
                'Risk Accepted',
                'Completed',
                'External Audit Delegated',
              ],
              description: 'The current status of the task',
            },
            action: {
              type: 'string',
              enum: [
                'Delegate to IT',
                'Submit Evidence',
                'Delegate to Auditor',
                'Confirm Evidence',
                'Return Evidence',
                'Delegate to External Auditor',
              ],
              description: 'The action being performed on the task',
            },
            feedback: {
              type: 'string',
              description: "Auditor's feedback for the task",
              nullable: true,
            },
            history: {
              type: 'array',
              items: { $ref: '#/components/schemas/ChangeHistory' },
              description: 'An array of change history records',
            },
            isAuditorConfirmedForNotApplicable: {
              type: 'boolean',
              description:
                'Indicates if the auditor has confirmed the "Not Applicable" status',
            },
          },
        },
        ComplianceSnapshot: {
          type: 'object',
          required: ['totalAssets', 'assets'],
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the snapshot was created',
            },
            totalAssets: {
              type: 'integer',
              description: 'Total number of assets in the snapshot',
            },
            assets: {
              type: 'array',
              items: {
                type: 'object',
                required: ['assetId'],
                properties: {
                  assetId: {
                    type: 'string',
                    description: 'Reference to the associated Asset (Asset ID)',
                  },
                  name: {
                    type: 'string',
                    description: 'Name of the asset',
                  },
                  type: {
                    type: 'string',
                    description: 'Type of the asset',
                  },
                  desc: {
                    type: 'string',
                    description: 'Description of the asset',
                  },
                  isScoped: {
                    type: 'boolean',
                    description: 'Indicates if the asset is scoped',
                  },
                  completionStatus: {
                    type: 'object',
                    properties: {
                      isCompleted: {
                        type: 'boolean',
                        description:
                          'Whether the asset completion status is true',
                      },
                      feedback: {
                        type: 'string',
                        description: 'Feedback for the asset, if any',
                      },
                      history: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['modifiedBy', 'changes'],
                          properties: {
                            modifiedAt: {
                              type: 'string',
                              format: 'date-time',
                              description:
                                'Timestamp of when the modification occurred',
                            },
                            modifiedBy: {
                              type: 'string',
                              description:
                                'ID of the person making the modification (User ID)',
                            },
                            changes: {
                              type: 'object',
                              additionalProperties: {
                                type: 'string',
                                description: 'Details of the changes made',
                              },
                            },
                          },
                        },
                        description:
                          'Array of history records for changes made to the asset',
                      },
                    },
                  },
                },
              },
              description: 'Array of asset details included in the snapshot',
            },
            overallRiskScore: {
              type: 'number',
              description: 'Overall risk score for the compliance snapshot',
            },
          },
        },
        Control: {
          type: 'object',
          required: [
            'section',
            'section_main_desc',
            'control_type',
            'control_Family_Id',
          ],
          properties: {
            fixed_id: {
              type: 'string',
              description: 'The fixed ID for the control',
            },
            isControl: {
              type: 'boolean',
              description: 'Whether the record represents a control',
            },
            section: {
              type: 'string',
              description: 'The section to which the control belongs',
            },
            section_main_desc: {
              type: 'string',
              description: 'Main description of the section',
            },
            section_desc: {
              type: 'string',
              description: 'Detailed description of the section',
            },
            control_type: {
              type: 'string',
              description: 'Type of the control',
            },
            control_Family_Id: {
              type: 'string',
              description: 'The control family ID that this control belongs to',
            },
            product_family_Id: {
              type: 'string',
              description: 'The product family ID associated with the control',
            },
            isDPDPA: {
              type: 'boolean',
              description: 'Whether the control is DPDPA-controlled',
            },
            criticality: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'The criticality level of the control',
            },
          },
        },
        ControlFamily: {
          type: 'object',
          required: ['variable_id'],
          properties: {
            fixed_id: {
              type: 'string',
              description: 'The fixed ID for the control family',
            },
            variable_id: {
              type: 'string',
              description: 'The variable ID for the control family',
            },
            isControlFamily: {
              type: 'string',
              default: 'true',
              description: 'Indicates if the record is a control family',
            },
            isDPDPA: {
              type: 'boolean',
              description:
                'Indicates if the control family is DPDPA-controlled',
            },
          },
        },
        Coverage: {
          type: 'object',
          required: ['coverageCount'],
          properties: {
            coverageCount: {
              type: 'integer',
              default: 0,
              description: 'The number of coverage entries for the scope',
            },
            scoped: {
              type: 'string',
              description:
                'Reference to the associated Scoped ID (if applicable)',
            },
            criticality: {
              type: 'boolean',
              description: 'Indicates if the coverage is critical',
            },
            businessOwnerName: {
              type: 'string',
              description: 'Name of the business owner',
            },
            businessOwnerEmail: {
              type: 'string',
              description: 'Email of the business owner',
            },
            itOwnerName: {
              type: 'string',
              description: 'Name of the IT owner',
            },
            itOwnerEmail: {
              type: 'string',
              description: 'Email of the IT owner',
            },
          },
        },
        Evidence: {
          type: 'object',
          required: ['fileName', 'fileType', 'fileSize', 'fileUrl'],
          properties: {
            fileName: {
              type: 'string',
              description: 'Name of the file',
            },
            fileType: {
              type: 'string',
              description: 'Type of the file (e.g., pdf, docx)',
            },
            fileSize: {
              type: 'integer',
              description: 'Size of the file in bytes',
            },
            fileUrl: {
              type: 'string',
              description: 'URL where the file is stored',
            },
            assetId: {
              type: 'string',
              description: 'Reference to the associated Asset ID',
            },
            scopeId: {
              type: 'string',
              description: 'Reference to the associated Scope ID',
            },
            actionId: {
              type: 'string',
              description: 'Reference to the associated Action ID',
            },
            familyId: {
              type: 'string',
              description: 'Reference to the associated Control Family ID',
            },
            controlId: {
              type: 'string',
              description: 'Reference to the associated Control ID',
            },
            username: {
              type: 'string',
              description: 'Username who uploaded the file',
            },
          },
        },
        It: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: {
              type: 'string',
              description: 'Name of the IT personnel',
            },
            email: {
              type: 'string',
              description: 'Email address of the IT personnel',
            },
            asset: {
              type: 'string',
              description: 'Reference to the associated Asset ID',
            },
          },
        },
        Message: {
          type: 'object',
          required: ['userId', 'message'],
          properties: {
            userId: {
              type: 'string',
              description: 'Reference to the User who will receive the message',
            },
            message: {
              type: 'string',
              description: 'Content of the message',
            },
            completionStatusId: {
              type: 'string',
              description: 'Reference to the associated CompletionStatus ID',
            },
            status: {
              type: 'string',
              enum: ['pending', 'sent', 'read'],
              default: 'pending',
              description: 'Status of the message (pending, sent, or read)',
            },
            isRead: {
              type: 'boolean',
              default: false,
              description: 'Indicates whether the message has been read',
            },
            readAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the message was read',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              default: 'current timestamp',
              description: 'Timestamp when the message was created',
            },
          },
        },
        NewAction: {
          type: 'object',
          required: [
            'variable_id',
            'control_Id',
            'product_family_Id',
            'softwareId',
          ],
          properties: {
            fixed_id: {
              type: 'string',
              description: 'Unique fixed identifier for the action',
            },
            variable_id: {
              type: 'string',
              description: 'Variable identifier for the action',
            },
            control_Id: {
              type: 'string',
              description: 'Reference to the associated Control ID',
            },
            product_family_Id: {
              type: 'string',
              description: 'Reference to the associated Product Family ID',
            },
            softwareId: {
              type: 'string',
              description: 'Reference to the associated Software ID',
            },
            description: {
              type: 'string',
              description: 'Software-specific task description',
            },
            isDPDPA: {
              type: 'boolean',
              description: 'Indicates whether the action is related to DPDPA',
            },
            isAction: {
              type: 'boolean',
              description: 'Indicates whether this is an action',
            },
          },
        },
        Notification: {
          type: 'object',
          required: ['assignedTo', 'message', 'assetId', 'status'],
          properties: {
            assignedTo: {
              type: 'string',
              description:
                'Reference to the User who is assigned the notification',
            },
            message: {
              type: 'string',
              description: 'Content of the notification message',
            },
            isRead: {
              type: 'boolean',
              default: false,
              description: 'Indicates whether the notification has been read',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the notification was created',
            },
            assetId: {
              type: 'string',
              description: 'Reference to the associated Asset ID',
            },
            status: {
              type: 'string',
              enum: ['completed', 'pending', 'error'],
              description: 'Status of the notification',
            },
            readAt: {
              type: 'string',
              format: 'date-time',
              default: null,
              description: 'Timestamp when the notification was read',
            },
          },
        },
        ProductFamily: {
          type: 'object',
          required: ['family_name', 'category'],
          properties: {
            family_name: {
              type: 'string',
              description: 'Name of the product family',
            },
            category: {
              type: 'string',
              description: 'Category of the product family',
            },
            software_list: {
              type: 'array',
              items: {
                type: 'string',
                description:
                  'References to associated Software IDs in the product family',
              },
            },
          },
        },
        Quiz: {
          type: 'object',
          required: ['title', 'training', 'questions', 'passingScore'],
          properties: {
            title: {
              type: 'string',
              description: 'Title of the quiz',
            },
            training: {
              type: 'string',
              description: 'Reference to the associated Training program',
            },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                required: ['questionText', 'options'],
                properties: {
                  questionText: {
                    type: 'string',
                    description: 'Text of the quiz question',
                  },
                  options: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['optionText', 'isCorrect'],
                      properties: {
                        optionText: {
                          type: 'string',
                          description: 'Text for the option',
                        },
                        isCorrect: {
                          type: 'boolean',
                          description:
                            'Indicates if this option is the correct answer',
                        },
                      },
                    },
                  },
                },
              },
            },
            passingScore: {
              type: 'integer',
              description: 'Minimum score required to pass the quiz',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the quiz was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the quiz was last updated',
            },
          },
        },
        Role: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              description: 'Name of the role',
            },
          },
        },

        Scoped: {
          type: 'object',
          required: ['name', 'asset'],
          properties: {
            name: { type: 'string', description: 'Name of the scoped data' },
            desc: {
              type: 'string',
              description: 'Description of the scoped data',
            },
            asset: {
              type: 'string',
              description: 'Reference to the associated asset',
            },
          },
        },
        Software: {
          type: 'object',
          required: ['software_name'],
          properties: {
            software_name: {
              type: 'string',
              description: 'Name of the software',
            },
            description: {
              type: 'string',
              description: 'Description of the software (optional)',
            },
          },
        },
        StepTask: {
          type: 'object',
          required: ['title', 'stepType'],
          properties: {
            title: {
              type: 'string',
              description: 'Title of the step/task',
            },
            userId: {
              type: 'string',
              description: 'Reference to the User who is assigned the task',
            },
            description: {
              type: 'string',
              description: 'Description for the task/step',
            },
            stepType: {
              type: 'string',
              enum: ['step', 'task'],
              description: 'Indicates whether this is a step or a task',
            },
            parentStep: {
              type: 'string',
              description:
                'Reference to the parent step, if this is a sub-task',
            },
            order: {
              type: 'integer',
              description: 'Order of execution for steps/tasks',
            },
            completed: {
              type: 'boolean',
              description: 'Indicates whether the task/step is completed',
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the task/step was completed',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the step/task was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the step/task was last updated',
            },
          },
        },
        Training: {
          type: 'object',
          required: ['title', 'program', 'description'],
          properties: {
            title: {
              type: 'string',
              description: 'Title of the training program',
            },
            program: {
              type: 'string',
              description: 'Name of the training program',
            },
            description: {
              type: 'string',
              description: 'Detailed description of the training program',
            },
            lectures: {
              type: 'array',
              items: {
                type: 'object',
                required: ['title', 'url'],
                properties: {
                  title: {
                    type: 'string',
                    description: 'Title of the lecture',
                  },
                  url: {
                    type: 'string',
                    description: 'URL to the lecture (e.g., video link)',
                  },
                  duration: {
                    type: 'integer',
                    description: 'Duration of the lecture in minutes',
                  },
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the training program was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description:
                'Timestamp when the training program was last updated',
            },
          },
        },
        User: {
          type: 'object',
          required: ['username', 'email', 'password', 'role'],
          properties: {
            username: {
              type: 'string',
              description: 'Username of the user',
            },
            email: {
              type: 'string',
              description: 'Email address of the user',
            },
            password: {
              type: 'string',
              description: 'Password for the user account',
            },
            role: {
              type: 'string',
              enum: [
                'Admin',
                'Executive',
                'Compliance Team',
                'IT Team',
                'Auditor',
                'External Auditor',
                'user',
              ],
              description: 'Role of the user in the system',
            },
            permissions: {
              type: 'object',
              properties: {
                view: {
                  type: 'boolean',
                  description: 'Indicates whether the user has view permission',
                },
                add: {
                  type: 'boolean',
                  description: 'Indicates whether the user can add data',
                },
                edit: {
                  type: 'boolean',
                  description: 'Indicates whether the user can edit data',
                },
                delegate: {
                  type: 'boolean',
                  description: 'Indicates whether the user can delegate tasks',
                },
                uploadEvidence: {
                  type: 'boolean',
                  description: 'Indicates whether the user can upload evidence',
                },
                confirmEvidence: {
                  type: 'boolean',
                  description:
                    'Indicates whether the user can confirm evidence',
                },
              },
            },
            hasCompletedCompanyForm: {
              type: 'boolean',
              description:
                'Indicates whether the user has completed the company form',
            },
            company: {
              type: 'string',
              description: 'Reference to the associated CompanyForm',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the user account was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the user account was last updated',
            },
          },
        },
        UserAnswer: {
          type: 'object',
          required: ['user', 'quiz', 'answers'],
          properties: {
            user: {
              type: 'string',
              description: 'Reference to the User who answered the quiz',
            },
            quiz: {
              type: 'string',
              description: 'Reference to the Quiz that the user has answered',
            },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                required: ['questionId', 'selectedOptionId'],
                properties: {
                  questionId: {
                    type: 'string',
                    description: 'Reference to the question that was answered',
                  },
                  selectedOptionId: {
                    type: 'string',
                    description: 'Reference to the option selected by the user',
                  },
                },
              },
            },
            score: {
              type: 'integer',
              description: 'The score the user achieved on the quiz',
              default: 0,
            },
            passed: {
              type: 'boolean',
              description: 'Indicates whether the user passed the quiz',
              default: false,
            },
            submittedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the answers were submitted',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the user answer record was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description:
                'Timestamp when the user answer record was last updated',
            },
          },
        },
        UserResponse: {
          type: 'object',
          required: ['companyId', 'productFamily', 'isValid'],
          properties: {
            companyId: {
              type: 'string',
              description: 'Reference to the associated company form',
            },
            productFamily: {
              type: 'string',
              description:
                'Reference to the product family associated with the response',
            },
            selectedSoftware: {
              type: 'string',
              description: 'Reference to the selected software',
              default: null,
            },
            otherSoftware: {
              type: 'string',
              description:
                'Name of the software selected if not from the predefined list',
              default: '',
            },
            isValid: {
              type: 'boolean',
              description: 'Indicates whether the response is valid',
              default: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the response was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the response was last updated',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  // Swagger UI route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerDocs;
