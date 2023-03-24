How to run
-

1. docker-compose up -d
2. ./run_siege.sh for generate load

Test results
--

1. With default cache expiration
![](./test_results/default_cache_expiration.png)
2. Probabilistic cache expiration (left 60 seconds, 0,5 random value)
![](./test_results/probabilistic_cache_expiration_1-60-5.png)
3. Probabilistic cache expiration (left 60 seconds, 0,7 random value)
![](./test_results/probabilistic_cache_expiration_2-60-7.png)
4. Probabilistic cache expiration (left 90 seconds, 0,3 random value)
![](./test_results/probabilistic_cache_expiration_3-90-3.png)