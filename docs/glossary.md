# ChoreChamp Glossary

Definitions of all terms, concepts, and features used in ChoreChamp.

---

## Core Concepts

### Token

The virtual currency that children earn for completing chores. Tokens accumulate in a child's balance and can be redeemed for rewards.

**See also:**
- Token Balance
- Token Ledger
- Streak Bonus

---

### Chore

A recurring task template that a caregiver creates. Defines the task name, token value, recurrence pattern, and category.

**Example:** "Pack out the dishwasher" — 10 tokens, daily, Kitchen

**See also:**
- Chore Occurrence
- Recurrence Pattern

---

### Chore Occurrence

A specific instance of a chore assigned to a child on a particular date. Has a status (pending, in progress, submitted, approved, rejected, overdue).

**Example:** "Pack out the dishwasher" assigned to John on Monday, April 20

**See also:**
- Chore
- Status

---

### Reward

An item, privilege, or experience that children can redeem tokens for. Created and managed by caregivers.

**Example:** "30 minutes screen time" — 50 tokens

**See also:**
- Requested Reward
- Redemption

---

## Chore Statuses

| Status | Description |
|-------|------------|
| **Pending** | Created, assigned, not yet due or started |
| **In Progress** | Started by child |
| **Submitted** | Marked complete by child, awaiting parent approval |
| **Approved** | Parent confirmed done — tokens awarded |
| **Rejected** | Parent rejected — child can resubmit |
| **Overdue** | Past due date, not completed |

---

## Recurrence Patterns

| Pattern | Description |
|---------|------------|
| **Daily** | Every day |
| **Weekdays** | Monday through Friday |
| **Weekly** | Once per week (user selects day) |
| **Monthly** | Once per month (user selects date) |
| **One-time** | Single occurrence, no recurrence |

---

## Token System

### Token Balance

The current number of tokens a child has available to spend.

**See also:**
- Token
- Token Ledger

### Token Ledger

A complete history log of all token transactions for a child — both credits (earned) and debits (spent).

**See also:**
- Token Balance

### Streak Bonus

Bonus tokens awarded for consecutive days of completing chores. Milestones at:
- 3-day streak
- 7-day streak
- 14-day streak
- 30-day streak

**Example:** Complete chores 7 days in a row = 7-day streak bonus

---

## Reward Suggestions

### Achievable Reward

A reward that a child can currently afford with their token balance.

**See also:**
- Token Balance

### Close Reward

A reward that is almost affordable — the app shows how many more tokens are needed to reach it.

**Example:** "25 more tokens needed"

### Requested Reward

A reward suggested by a child that requires parent approval before becoming available in the reward shop.

**See also:**
- Reward

---

## AI Features

### Voice Chore Creation

An AI-powered voice feature that allows caregivers to create chores hands-free using natural language.

**Example:** "Create a chore to pack out the dishwasher in 1 hour for John"

The app parses:
- Task name: "pack out the dishwasher"
- Duration: "1 hour"
- Assignee: "John"
- Recurrence: (implicit based on phrasing)

**See also:**
- Chore

---

## User Roles

### Caregiver

A parent or guardian who manages the household, creates chores, approves completions, and manages rewards.

**Permissions:**
- Create/edit/delete chores
- Approve/reject chore submissions
- Create/edit/delete rewards
- Approve/reject reward redemptions
- Manage children

**See also:**
- Household
- Child

### Child

A family member who completes chores to earn tokens and redeem them for rewards.

**Permissions:**
- View assigned chores
- Submit chore completions
- View token balance
- Redeem tokens for rewards

**See also:**
- Caregiver
- Token

---

## Household

### Household

The family grouping in ChoreChamp. All members (caregivers and children) belong to a single household.

**Contains:**
- Caregiver accounts
- Child accounts
- Chore templates
- Rewards pool

**See also:**
- Caregiver
- Child

---

## Transactions

### Redemption

The act of spending tokens to obtain a reward. Requires parent approval if the reward is custom.

**Flow:**
1. Child selects reward
2. Tokens debited from balance
3. Parent approves redemption
4. Child receives reward

**See also:**
- Token Balance
- Reward
- Requested Reward