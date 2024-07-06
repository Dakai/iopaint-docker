import sys
import time

def main():
    """Prints provided arguments and keeps running until interrupted."""
    print("Started with arguments:", *sys.argv[1:], flush=True)

    count = 0
    try:
        while True:
            time.sleep(1)  # Sleep for a second to avoid excessive CPU usage
            count += 1
            if count % 5 == 0:
                print(f"Still running... (count: {count})", flush=True)
            if count % 10 == 0:
                print(f"This is an error message (count: {count})", file=sys.stderr, flush=True)
    except KeyboardInterrupt:
        print("\nProgram stopped.", flush=True)

if __name__ == "__main__":
    main()
