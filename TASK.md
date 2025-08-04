# Backend Assignment: Fault-Tolerant System Design

## Overview

Create a fault-tolerant backend system that processes tasks in an event-driven architecture, ensuring graceful handling of failures and retries. The goal is to evaluate your ability to design a reliable, scalable, and robust system using AWS services. This assignment focuses on building a system where failures are anticipated and mitigated without data loss or processing inconsistencies.

## Specifications

This system will simulate a data processing pipeline where:

- Tasks are submitted to an API.
- The system processes these tasks asynchronously using AWS Lambda and SQS.
- Failures are retried and eventually routed to a dead-letter queue (DLQ) if not resolved.

### System Workflow:

#### Step 1: Task Submission:

Create an API endpoint (using AWS API Gateway and Lambda) that accepts a task submission. Each task contains:

- taskId (string, unique)
- payload (JSON object with arbitrary data)

#### Step 2: Task Processing:

Submit tasks to an SQS queue for asynchronous processing.
A Lambda function consumes tasks from the queue and simulates task processing.

#### Step 3: Failure Handling:

Simulate task processing failures randomly for 30% of the tasks.
Implement an exponential backoff retry strategy for failed tasks.
Route tasks that fail after the maximum retry attempts (2) to a dead-letter queue (DLQ) for later inspection.

#### Step 4: DLQ Monitoring:

Add a Lambda function that monitors the DLQ and logs the details of failed tasks in CloudWatch.

### Design Constraints:

Use only AWS services (API Gateway, Lambda, SQS, DynamoDB, CloudWatch).

- Write the Lambda functions in Node.js.
- Use the Serverless framework to deploy and manage the stack.

### Key Features:

- API:
  - POST endpoint for submitting tasks.

- Queues:
  - Use an SQS queue for task processing.
  - Use a DLQ for tasks that cannot be processed after retries.

- Error Simulation:
  - Randomly simulate task processing failures (e.g., throw an error 30% of the time).

- Retry Strategy:
  - Use an exponential backoff strategy for failed task retries.

- Monitoring:
  - Log details of tasks in the DLQ to CloudWatch, including taskId, payload, and the error message.

- Documentation:
  - Include a README file that explains:
    - How to deploy the system.
    - A high-level architecture diagram.
    - Instructions for testing the system, including simulated failures.
    - Assumptions made.

### Submission:

- Git Repository:
  - Include all code and deployment configuration files.
  - Provide a README.md with:
    - Setup instructions.
    - Architecture overview.
    - Testing instructions and assumptions made.
