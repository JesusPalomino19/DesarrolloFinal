# Crear una instancia EC2
resource "aws_instance" "ec2_gestion_cuartos" {
  ami           = "ami-01816d07b1128cd2d" # Cambia por una AMI válida en tu región
  instance_type = "t2.micro" 
  
  subnet_id = aws_subnet.public_a.id

  vpc_security_group_ids = [aws_security_group.security_group_example_app.id]
  associate_public_ip_address = true

  # Etiquetas para organizar recursos
  tags = {
    Name = "Gestion-Cuartos"
  }

  user_data = <<-EOF
                #!/bin/bash
                # Actualizar paquetes existentes
                sudo yum update -y
                
                # Instalar Git y Node.js
                sudo yum install -y git
                sudo yum install -y nodejs
                sudo amazon-linux-extras enable docker
                sudo yum install docker -y

                # Inicia el servicio de Docker
                sudo service docker start

                # Clonar el repositorio
                git clone https://github.com/JesusPalomino19/DesarrolloFinal.git
                
                #Ingreso al directorio
                cd DesarrolloFinal

                #Ingreso al backend
                cd backend
                
                #Levantamiento de backend
                node src/app.js &

                #Regresa a la carpeta principal
                cd ..

                #Ingreso al frontend
                cd frontend

                # Instalar dependencias del proyecto
                npm install
                
                #Levantamiento de backend
                npm start &

                #ejecucion del servidor de jaeger
                docker run -d --name jaeger \
                -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
                -p 5775:5775/udp \
                -p 6831:6831/udp \
                -p 6832:6832/udp \
                -p 5778:5778 \
                -p 16686:16686 \
                -p 14268:14268 \
                -p 14250:14250 \
                -p 9411:9411 \
                jaegertracing/all-in-one:1.46

                EOF
}