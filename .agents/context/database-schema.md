# Database Schema

This document represents the current ground truth of the database schema for the project.

## Tables

### `users`
- Description: Stores user account information and subscription tier.
- Relations:
  - Has many Favorites
  - Has many Custom Lists
  - Has one User Search Limit

#### Columns
| Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | Primary Key | Unique identifier (UUID) |
| `username` | TEXT | Unique, Not Null | User's chosen name |
| `email` | TEXT | Unique, Not Null | User's email address |
| `password_hash` | TEXT | Not Null | bcrypt hash of password |
| `tier` | TEXT | Default 'free' | Subscription tier ('free' or 'explorer') |
| `created_at` | TIMESTAMP | Default CURRENT_TIMESTAMP | Creation timestamp |

### `favorites`
- Description: Stores activities favorited by users.
- Relations:
  - Belongs to User

#### Columns
| Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL/INTEGER | Primary Key | Auto-incrementing ID |
| `user_id` | TEXT | Not Null, FK (users.id) | User who favorited the activity |
| `activity_data` | TEXT | Not Null | JSON stringified activity data |
| `created_at` | TIMESTAMP | Default CURRENT_TIMESTAMP | When it was favorited |

### `custom_lists`
- Description: Custom lists created by Explorer+ users to organize activities.
- Relations:
  - Belongs to User
  - Has many List Items

#### Columns
| Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | Primary Key | Unique identifier (UUID) |
| `user_id` | TEXT | Not Null, FK (users.id) | Owner of the list |
| `name` | TEXT | Not Null | List name |
| `description` | TEXT | | Optional description |
| `icon` | TEXT | Default '📋' | Emoji icon for the list |
| `created_at` | TIMESTAMP | Default CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Default CURRENT_TIMESTAMP | Last updated timestamp |

### `list_items`
- Description: Activities saved within a specific custom list.
- Relations:
  - Belongs to Custom List

#### Columns
| Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | Primary Key | Unique identifier (UUID) |
| `list_id` | TEXT | Not Null, FK (custom_lists.id) | List this item belongs to |
| `activity_data` | TEXT | Not Null | JSON stringified activity data |
| `added_at` | TIMESTAMP | Default CURRENT_TIMESTAMP | When it was added |

### `user_search_limits`
- Description: Tracks search usage for Free tier users.
- Relations:
  - Belongs to User

#### Columns
| Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | TEXT | Primary Key, FK (users.id) | User being tracked |
| `search_count` | INTEGER | Default 0 | Number of searches performed |
| `last_reset_date` | DATE | Default CURRENT_DATE | Last time the count was reset |
