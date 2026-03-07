import argparse
import sys
import json
import requests

JULES_API_URL = "https://jules.googleapis.com/v1alpha/sessions"
# In a real app we'd load this from .env, but hardcoding for this utility test
API_KEY = "AQ.Ab8RN6Lkig9MpqESJxnsc8t7zy8TAcAWRvSj--U_jFzji0pGwA"
DEFAULT_SOURCE = "github.com/tushar-1226/Selectify"

def create_session(prompt, source=DEFAULT_SOURCE):
    """Creates a new Jules session with the given prompt."""
    url = f"{JULES_API_URL}?key={API_KEY}"
    
    # Constructing a generic payload. Depending on API response, 
    # we may need to tune the exact field names (e.g., description vs task vs intent)
    payload = {
        "prompt": f"Repository Context: {source}\n\nTask: {prompt}"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    print(f"[*] Starting Jules Agent session for repository: {source}")
    print(f"[*] Prompt: \"{prompt}\"\n")
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        session_data = response.json()
        print("[+] Session created successfully!")
        if "url" in session_data:
            print(f"[>] Track Jules progress here: {session_data['url']}")
        else:
            print(json.dumps(session_data, indent=2))
        return session_data
        
    except requests.exceptions.HTTPError as e:
        print(f"[-] HTTP Error: {e.response.status_code}")
        try:
            print(json.dumps(e.response.json(), indent=2))
        except ValueError:
            print(e.response.text)
        sys.exit(1)
    except Exception as e:
        print(f"[-] Request Error: {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Google Jules API CLI Utility")
    parser.add_argument("prompt", type=str, help="The coding task or prompt for Jules to execute", nargs="?")
    parser.add_argument("--test-connection", action="store_true", help="Test the connection to the Jules API")
    parser.add_argument("--source", type=str, default=DEFAULT_SOURCE, help="The GitHub repository source (e.g., github.com/user/repo)")
    
    args = parser.parse_args()

    # Test API connection
    if args.test_connection:
        print("[*] Testing connection to Jules API...")
        url = f"{JULES_API_URL}?key={API_KEY}"
        try:
            response = requests.get(url)
            response.raise_for_status()
            print("[+] Connection successful! Current sessions:")
            print(json.dumps(response.json(), indent=2))
        except requests.exceptions.HTTPError as e:
            print(f"[-] HTTP Error: {e.response.status_code}")
            try:
                print(json.dumps(e.response.json(), indent=2))
            except ValueError:
                print(e.response.text)
        except Exception as e:
             print(f"[-] Request Error: {e}")
        return

    # Create new session
    if not args.prompt:
        parser.print_help()
        sys.exit(1)

    create_session(args.prompt, args.source)

if __name__ == "__main__":
    main()
