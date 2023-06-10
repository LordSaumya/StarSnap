from google_images_search import GoogleImagesSearch

gis = GoogleImagesSearch('', '')
query = input("Enter your search query: ")
numberOfResults = int(input("Enter the number of images you want to download: "))
gis.search(search_params = {'q': query, 'num': numberOfResults, 'fileType': 'jpg'} , path_to_dir='/images/', custom_image_name = query)
gis.results()