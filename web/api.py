import requests
import config

def make_api_call():
    url = "https://api.pexels.com/v1/search"
    headers = {
        "Authorization": config.api_key
    }
    params = {
        "query": "nature",
        "per_page": 1
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        img_url = data["photos"][0]["src"]["original"]
        return img_url
    except requests.exceptions.RequestException as e:
        print("Error making API request:", e)
        return None


img_url = make_api_call()
if img_url:
    print(img_url)

else:
    print("Failed to retrieve API response.")

