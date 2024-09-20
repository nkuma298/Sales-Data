const fs = require('fs');

// Read the sales data from sales-data.txt
fs.readFile('sales-data.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const lines = data.trim().split('\n').slice(1); // Skip the header
    let totalSales = 0;
    const monthSales = {};

    // Process the data
    lines.forEach(line => {
        const [date, sku, , quantityStr, totalPriceStr] = line.split(',');
        const quantity = parseInt(quantityStr);
        const totalPrice = parseFloat(totalPriceStr);
        const month = date.substring(0, 7); // YYYY-MM

        // Update total sales
        totalSales += totalPrice;

        // Initialize month data if not already present
        if (!monthSales[month]) {
            monthSales[month] = { total: 0, items: {} };
        }

        // Update monthly total sales
        monthSales[month].total += totalPrice;

        // Update item sales in the month
        const itemData = monthSales[month].items[sku] || { quantity: 0, revenue: 0, orders: [] };
        itemData.quantity += quantity;
        itemData.revenue += totalPrice;
        itemData.orders.push(quantity);
        monthSales[month].items[sku] = itemData;
    });

    // Reporting results
    console.log(`Total Sales of the Store: ${totalSales.toFixed(2)}`);

    // Month-wise sales totals
    console.log("\nMonth-wise Sales Totals:");
    Object.entries(monthSales).forEach(([month, info]) => {
        console.log(`${month}: ${info.total.toFixed(2)}`);
    });

    // Most popular item and items generating most revenue in each month
    console.log("\nMost Popular Item and Revenue Generating Item in Each Month:");
    Object.entries(monthSales).forEach(([month, info]) => {
        const items = info.items;
        const mostPopularItem = Object.entries(items).reduce((a, b) => a[1].quantity > b[1].quantity ? a : b);
        const mostRevenueItem = Object.entries(items).reduce((a, b) => a[1].revenue > b[1].revenue ? a : b);

        console.log(`${month}: Most Popular: ${mostPopularItem[0]} (Quantity: ${mostPopularItem[1].quantity}), ` +
                    `Most Revenue: ${mostRevenueItem[0]} (Revenue: ${mostRevenueItem[1].revenue.toFixed(2)})`);
    });

    // Order statistics for the most popular item each month
    console.log("\nOrder Statistics for Most Popular Item Each Month:");
    Object.entries(monthSales).forEach(([month, info]) => {
        const mostPopularItem = Object.entries(info.items).reduce((a, b) => a[1].quantity > b[1].quantity ? a : b);
        const orders = mostPopularItem[1].orders;

        const minOrders = Math.min(...orders);
        const maxOrders = Math.max(...orders);
        const avgOrders = orders.reduce((sum, order) => sum + order, 0) / orders.length;

        console.log(`${month}: Min: ${minOrders}, Max: ${maxOrders}, Average: ${avgOrders.toFixed(2)}`);
    });
});
