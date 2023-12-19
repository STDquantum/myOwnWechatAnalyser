import os

import pilk

def decodeSilk(path):
    pilk.decode(path, "test.pcm", 44100)
    os.system(f"ffmpeg.exe -y -f s16le -i test.pcm -ar 44100 -ac 1 test.mp3")


# cnt = 0
# for dirpath, dirnames, filenames in os.walk("voice2"):
#     for i in filenames:
#         cnt = cnt + 1
#         pilk.decode(os.path.join(dirpath, i), "test.pcm", 44100)
#         os.system(f"ffmpeg.exe -y -f s16le -i test.pcm -ar 44100 -ac 1 voice\\{i}.mp3")
#         if cnt == 100:
#             break
#     if cnt == 100:
#         break

decodeSilk("1.silk")