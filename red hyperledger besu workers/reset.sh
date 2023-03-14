docker-compose down
sudo rm -rf ./node0/data/
sudo rm -rf ./node1/data/
sudo rm -rf ./node2/data/

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
