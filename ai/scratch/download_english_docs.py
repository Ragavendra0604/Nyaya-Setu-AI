import os
import requests
from concurrent.futures import ThreadPoolExecutor

urls = [
    ("Act_1_of_2024.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2024/Act_1_of_2024.pdf"),
    ("Act_43_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2043%20of%202023.pdf"),
    ("Act_44_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2044%20of%202023.pdf"),
    ("Act_45_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2045%20of%202023.pdf"),
    ("Act_46_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2046%20of%202023.pdf"),
    ("Act_47_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2047%20of%202023.pdf"),
    ("Act_48_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2048%20of%202023.pdf"),
    ("Act_49_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2049%20of%202023.pdf"),
    ("Act_50_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2050%20of%202023.pdf"),
    ("Act_34_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2034%20of%202023.pdf"),
    ("Act_35_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2035%20of%202023.pdf"),
    ("Act_36_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2036%20of%202023.pdf"),
    ("Act_37_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2037%20of%202023.pdf"),
    ("Act_38_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2038%20of%202023.pdf"),
    ("Act_25_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2025%20of%202023.pdf"),
    ("Act_26_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2026%20of%202023.pdf"),
    ("Act_40_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2040%20of%202023.pdf"),
    ("Act_27_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2027%20of%202023.pdf"),
    ("Act_20_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2020%20of%202023.pdf"),
    ("Act_32_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2032%20of%202023.pdf"),
    ("Act_21_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2021%20of%202023.pdf"),
    ("Act_11_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2011%20of%202023.pdf"),
    ("Act_18_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2018%20of%202023.pdf"),
    ("Act_15_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2015%20of%202023.pdf"),
    ("Act_16_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2016%20of%202023.pdf"),
    ("Act_17_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2017%20of%202023.pdf"),
    ("Act_22_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2022%20of%202023.pdf"),
    ("Act_23_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2023%20of%202023.pdf"),
    ("Act_24_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2024%20of%202023.pdf"),
    ("Act_30_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2030%20of%202023.pdf"),
    ("Act_31_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2031%20of%202023.pdf"),
    ("Act_12_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2012%20of%202023.pdf"),
    ("Act_29_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2023/Act%2029%20of%202023.pdf"),
    ("Act_18_of_2022.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2022/Act%2018%20of%202022.pdf"),
    ("Act_19_of_2022.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2022/Act%2019%20of%202022.pdf"),
    ("Act_23_of_2022.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2022/Act%2023%20of%202022.pdf"),
    ("Act_3_of_2023.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2022/Act%203%20of%202023.pdf"),
    ("Act_14_of_2022.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2022/Act%2014%20of%202022.pdf"),
    ("Act_13_of_2022.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2022/Act%2013%20of%202022.pdf"),
    ("Act_12_of_2022.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2022/Act%2012%20of%202022.pdf"),
    ("Act_11_of_2022.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2022/Act%2011%20of%202022.pdf"),
    ("Act_10_of_2022.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2022/Act%2010%20of%202022.pdf"),
    ("Act_9_of_2022.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2022/Act%209%20of%202022.pdf"),
    ("Act_41_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2041%20of%202021.pdf"),
    ("Act_42_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2042%20of%202021.pdf"),
    ("Act_47_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2047%20of%202021.pdf"),
    ("Act_43_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2043%20of%202021.pdf"),
    ("Act_44_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2044%20of%202021.pdf"),
    ("Act_45_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2045%20of%202021.pdf"),
    ("Act_40_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2040%20of%202021.pdf"),
    ("Act_34_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2034%20of%202021.pdf"),
    ("Act_37_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2037%20of%202021.pdf"),
    ("Act_31_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2031%20of%202021.pdf"),
    ("Act_30_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2030%20of%202021.pdf"),
    ("Act_33_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2033%20of%202021.pdf"),
    ("Act_29_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2029%20of%202021.pdf"),
    ("Act_25_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2025%20of%202021.pdf"),
    ("Act_23_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2023%20of%202021.pdf"),
    ("Act_24_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2024%20of%202021.pdf"),
    ("Act_21_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2021%20of%202021.pdf"),
    ("Act_20_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2020%20of%202021.pdf"),
    ("Act_17_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2017%20of%202021.pdf"),
    ("Act_16_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2016%20of%202021.pdf"),
    ("Act_18_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2018%20of%202021.pdf"),
    ("Act_11_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2011%20of%202021.pdf"),
    ("Act_14_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2014%20of%202021.pdf"),
    ("Act_15_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2015%20of%202021.pdf"),
    ("Act_8_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%208%20of%202021.pdf"),
    ("Act_19_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%2019%20of%202021.pdf"),
    ("Act_3_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%203%20of%202021.pdf"),
    ("Act_5_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%205%20of%202021.pdf"),
    ("Act_1_of_2021.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2021/Act%201%20of%202021.pdf"),
    ("Act_38_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2038%20of%202020.pdf"),
    ("Act_33_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2033%20of%202020.pdf"),
    ("Act_30_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2030%20of%202020.pdf"),
    ("Act_37_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2037%20of%202020.pdf"),
    ("Act_36_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2036%20of%202020.pdf"),
    ("Act_35_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2035%20of%202020.pdf"),
    ("Act_29_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2029%20of%202020.pdf"),
    ("Act_32_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2032%20of%202020.pdf"),
    ("Act_31_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2031%20of%202020.pdf"),
    ("Act_21_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2021%20of%202020.pdf"),
    ("Act_20_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2020%20of%202020.pdf"),
    ("Act_22_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2022%20of%202020.pdf"),
    ("Act_16_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2016%20of%202020.pdf"),
    ("Act_34_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2034%20of%202020.pdf"),
    ("Act_39_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2039%20of%202020.pdf"),
    ("Act_19_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2019%20of%202020.pdf"),
    ("Act_2_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%202%20of%202020.pdf"),
    ("Act_1_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%201%20of%202020.pdf"),
    ("Act_3_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%203%20of%202020.pdf"),
    ("Act_5_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%205%20of%202020.pdf"),
    ("Act_18_of_2020.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2020/Act%2018%20of%202020.pdf"),
    ("Act_49_of_2019.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2019/Act%2049%20of%202019.pdf"),
    ("Act_48_of_2019.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2019/Act%2048%20of%202019.pdf"),
    ("Act_50_of_2019.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2019/Act%2050%20of%202019.pdf"),
    ("Act_44_of_2019.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2019/Act%2044%20of%202019.pdf"),
    ("Act_45_of_2019.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2019/Act%2045%20of%202019.pdf"),
    ("Act_47_of_2019.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2019/Act%2047%20of%202019.pdf"),
    ("Act_42_of_2019.pdf", "https://prsindia.org/files/bills_acts/acts_parliament/2019/Act%2042%20of%202019.pdf")
]

def download_file(pair):
    filename, url = pair
    path = os.path.join("ai", "data", "english", filename)
    if os.path.exists(path):
        return f"Skipped {filename}"
    try:
        r = requests.get(url, timeout=30)
        if r.status_code == 200:
            with open(path, "wb") as f:
                f.write(r.content)
            return f"Downloaded {filename}"
        else:
            return f"Failed {filename}: {r.status_code}"
    except Exception as e:
        return f"Error {filename}: {e}"

if __name__ == "__main__":
    os.makedirs(os.path.join("ai", "data", "english"), exist_ok=True)
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(download_file, urls))
        for res in results:
            print(res)
