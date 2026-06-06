import subprocess
import sys

def install_packages():
    packages = ['Flask==2.3.3', 'Flask-MySQLdb', 'pymysql']
    
    print("Installing required packages...")
    for package in packages:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✅ Installed {package}")
        except Exception as e:
            print(f"❌ Failed to install {package}: {e}")
    
    print("\n✅ All packages installed!")

if __name__ == "__main__":
    install_packages()