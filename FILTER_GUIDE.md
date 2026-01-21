# Order Filtering Guide

The bot now supports comprehensive filtering for orders. You can combine multiple filters in natural language!

## Available Filters

### 1. Status Filter
Filter by order status: pending, completed, under_process, cancelled

**Examples:**
- `show pending orders`
- `check all completed orders`
- `list pending and under process orders`

### 2. Tags Filter
Filter by tag names (e.g., HK, urgent, vip)

**Examples:**
- `orders tagged with HK`
- `check HK orders`
- `show orders with urgent tag`

### 3. Handler Filter
Filter by handler/user name (partial match supported)

**Examples:**
- `orders with handler morning`
- `show morning's orders`
- `list orders handled by admin`

### 4. Customer Filter
Filter by customer name (partial match supported)

**Examples:**
- `orders from Kevin`
- `show Kevin's orders`
- `check all orders for John`

### 5. Created By Filter
Filter by who created the order (partial match supported)

**Examples:**
- `orders created by admin`
- `check orders created by morning`
- `show admin's created orders`

### 6. Date Range Filter
Filter by time periods

**Supported ranges:**
- `today` - Today's orders
- `last week` - Last Monday to Sunday
- `this week` - This Monday to now
- `current month` / `this month` - 1st to 31st of current month
- `last month` - Previous month

**Examples:**
- `show last week orders`
- `orders from current month`
- `today's orders`
- `check this week orders`

### 7. Currency Pair Filter
Filter by currency pair (e.g., USDT/HKD, BTC/USD)

**Examples:**
- `USDT/HKD orders`
- `show all HKD/USD orders`
- `check BTC/USDT orders`

## Combining Multiple Filters

You can combine any filters naturally:

**Examples:**

1. **Status + Tags:**
   ```
   check pending orders tagged with HK
   ```
   ➜ Shows pending orders with HK tag

2. **Customer + Date:**
   ```
   show Kevin's orders from last week
   ```
   ➜ Shows Kevin's orders from last week

3. **Handler + Status:**
   ```
   list morning's pending orders
   ```
   ➜ Shows pending orders handled by morning

4. **Currency + Date + Status:**
   ```
   show completed USDT/HKD orders from current month
   ```
   ➜ Shows completed USDT/HKD orders from this month

5. **Creator + Status:**
   ```
   show pending orders created by admin
   ```
   ➜ Shows pending orders created by admin

6. **Multiple filters:**
   ```
   check pending HK orders from Kevin handled by morning
   ```
   ➜ Combines all filters

7. **Tags + Date:**
   ```
   show HK tagged orders from last month
   ```
   ➜ Shows HK orders from last month

8. **Created By + Date + Currency:**
   ```
   check USDT/HKD orders created by morning from last week
   ```
   ➜ Shows morning's USDT/HKD orders from last week

## Response Format

The bot will show:
- Order ID
- Amount and currencies
- Status
- Customer name (👥)
- Handler name (👤) if assigned
- Created by (✍️) who created the order
- Tags (🏷️) if any
- Filter description in header

**Example response:**
```
📋 **Orders (status: pending, tags: HK)** (3 found)

#123: 1000 HKD → 142.86 USDT | pending | 👥Kevin | 👤morning | ✍️admin | 🏷️HK
#122: 100 USDT → 700 HKD | pending | 👥John | 👤admin | ✍️morning | 🏷️HK,urgent
#120: 100 USDT → 500 HKD | pending | 👥Sarah | ✍️admin | 🏷️HK
```

## No Filters

If you don't specify any filters, you'll get the most recent 10 orders:

```
show recent orders
list orders
check orders
```

## Tips

1. **Natural Language:** Just type naturally - the AI understands context
2. **Partial Matches:** Customer and handler filters support partial matching
3. **Case Insensitive:** Filters work regardless of case
4. **Multiple Statuses:** You can filter multiple statuses: "pending and under process"
5. **Combine Freely:** Mix and match any filters

## Common Queries

| Query | What it does |
|-------|-------------|
| `check pending orders` | Show all pending orders |
| `orders from Kevin` | Show Kevin's orders |
| `last week orders` | Show orders from last week |
| `HK orders` | Show orders tagged with HK |
| `morning's orders` | Show orders handled by morning |
| `orders created by admin` | Show orders created by admin |
| `check orders created by morning` | Show orders created by morning |
| `USDT/HKD orders` | Show USDT/HKD currency pair |
| `pending HK orders from last week` | Combined filters |
| `completed orders from Kevin` | Kevin's completed orders |
| `today's pending orders` | Today's pending orders |
| `orders created by admin from last week` | Admin's orders from last week |
| `current month USDT/HKD orders` | This month's USDT/HKD orders |

## No Results

If no orders match your filters, you'll see:
```
📋 No orders found (status: pending, tags: HK).
```

This helps you understand which filters were applied.

---

**Note:** The bot uses AI to understand your intent, so you can phrase queries in many different ways. Experiment and see what works!
