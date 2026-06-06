import sys

try:
    import pymysql
    print("✅ pymysql is installed")
except ImportError:
    print("❌ pymysql not installed. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymysql"])
    import pymysql
    print("✅ pymysql installed successfully")

def test_mysql_connection():
    try:
        # Update these with your actual MySQL credentials
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='pravv',  # Your MySQL password
            database='cinesoul'  # Your database name
        )
        
        print("✅ Connected to MySQL successfully!")
        
        # Create a cursor
        cursor = connection.cursor()
        
        # Test query
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        if tables:
            print(f"✅ Found {len(tables)} table(s):")
            for table in tables:
                print(f"   - {table[0]}")
        else:
            print("ℹ️ No tables found in database")
            
        cursor.close()
        connection.close()
        
    except pymysql.err.OperationalError as e:
        print(f"❌ Connection failed: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Is MySQL running?")
        print("2. Are the credentials correct?")
        print(f"3. Does the database 'cinesoul' exist?")
        print(f"   Try: CREATE DATABASE IF NOT EXISTS cinesoul;")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_mysql_connection()