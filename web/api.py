import requests
import config

def make_api_call(object_name):
    url = "https://api.pexels.com/v1/search"
    headers = {
        "Authorization": config.api_key
    }
    params = {
        "query": object_name,
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


