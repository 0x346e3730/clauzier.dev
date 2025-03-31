---
title: 'Why is over-engineering your worst enemy'
pubDate: 2025-03-26
description: 'How some overlooked legacy things can ruin your production'
tags: ['php', 'symfony', 'api-platform']
draft: true
---

Spoiler : this article covers how I made a HUGE production improvement from one single, used a lot, over-engineered part of the application I was working on.

![Spoiler: CPU Chart](/images/blog/hashmapfix_cpu_chart.png)
*CPU usage (and spikes) before and after the fix*

![Spoiler: RAM Chart](/images/blog/hashmapfix_ram_chart.png)
*Memory usage before and after the fix*

With my experience, I've came to the conclusion that over-engineering is everyone's worst enemy.

When working on a product, there are multiple objectives wanted by different people even if everybody is working together. Often it can look something like that :
- The tech wants to produce "good", up-to-date, debt-free, maintanable code
- The product wants to deliver as much features / fixes as fast as possible
- The business wants to be able to monetize the product to get the biggest ROI

Over-engineering hurts all because : 
- It makes development time longer, making the time to market bigger
- It makes the actual deliveries lighter because of those (often unforeseen) delays
- It makes it harder to understand the code after not working on it for a while or if someone else encounters it

How to avoid over-engineering ? The KISS principle : **K**eep**I**t**S**imple**S**tupid !

It is rarely a good idea to try and do something while anticipating what can happen in medium/long term future. Let's dive into the actual case that I encountered at one of my previous job.
I'll just give some basic details : let's imagine a React front and an API-Platform back-end, where we want to calculate the stock of all the products of someone, some handled in quantity and some by serial numbers (so one database entry somewhere for each product / serial number combo).
This calculation would result in one API Endpoint, called in several places on the front : the invoice creation page, the stock management one, and the statistics for example.
