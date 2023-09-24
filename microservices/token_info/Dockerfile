# Use an official Python runtime as a parent image
FROM python:3.11.3-buster
# Set the working directory to /app
WORKDIR /app
# Copy the current directory contents into the container at /app
COPY . /app
# Install any needed packages specified in requirements.txt
RUN apt-get install -y ca-certificates
RUN pip3 install --trusted-host pypi.python.org -r requirements.txt
# Run myscript.py when the container launches
CMD ["python", "token_info.py"]
