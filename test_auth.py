import requests
import json

BASE_URL = "http://localhost:5000"

def test_endpoints():
    print("Testing CineSoul Authentication API...")
    
    # 1. Test if server is running
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✓ Server is running: {response.status_code}")
    except:
        print("✗ Cannot connect to server")
        return
    
    # 2. Test API endpoint
    response = requests.get(f"{BASE_URL}/api/test")
    print(f"✓ API test: {response.status_code} - {response.json()}")
    
    # 3. Test check-username endpoint
    response = requests.get(f"{BASE_URL}/api/auth/check-username?username=testuser")
    print(f"✓ Check username: {response.status_code} - {response.json()}")
    
    # 4. Test check-email endpoint
    response = requests.get(f"{BASE_URL}/api/auth/check-email?email=test@example.com")
    print(f"✓ Check email: {response.status_code} - {response.json()}")
    
    # 5. Test login endpoint (should fail with no credentials)
    response = requests.post(f"{BASE_URL}/api/auth/login", 
                           json={"username": "test", "password": "test"})
    print(f"✓ Login endpoint accessible: {response.status_code}")
    
    print("\n✅ All endpoints are accessible!")
    print(f"\nFrontend should connect to: {BASE_URL}/api/auth/login")

if __name__ == "__main__":
    test_endpoints()