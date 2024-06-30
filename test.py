import sys
import time

def main():
  """Prints provided arguments and keeps running until interrupted."""

  print("Started with arguments:", *sys.argv[1:])

  try:
    while True:
      time.sleep(1)  # Sleep for a second to avoid excessive CPU usage
  except KeyboardInterrupt:
    print("\nProgram stopped.")

if __name__ == "__main__":
  main()

